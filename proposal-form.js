import {initializeApp} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import {getDatabase,ref,onValue,runTransaction} from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-database.js';
import {FORM_VERSION,PROPOSAL_DEFAULT} from './proposal-data.js';

const app=initializeApp({apiKey:'AIzaSyA5UWJWmxthbG-4DmcUXmAm_b-6PnTbED8',authDomain:'ubilsem-kds.firebaseapp.com',databaseURL:'https://ubilsem-kds-default-rtdb.firebaseio.com',projectId:'ubilsem-kds',appId:'1:31206882948:web:6eefed6eb145cc4ee30cd1'},'egitim-ajandasi-proposal');
const db=getDatabase(app);
const path='egitim_ajandasi_v1/users/XTvKgz2yCoNs3c5v7628aZGAHxs1/jeoloji/proposalForm';
const $=id=>document.getElementById(id);
const clone=value=>JSON.parse(JSON.stringify(value));
let connected=false,loaded=false,busy=false,dirty=false,revision=0,remoteState=null,working=null;

function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node}
function setStatus(text,kind='info'){$('status').textContent=text;$('status').className='status '+kind}
function validForm(value){
 if(!value||value.formatVersion!==FORM_VERSION||!Number.isInteger(value.revision)||!Array.isArray(value.sections)||value.sections.length!==PROPOSAL_DEFAULT.length)return false;
 return value.sections.every((section,index)=>{
  const expected=PROPOSAL_DEFAULT[index];
  if(!section||section.title!==expected.title||section.kind!==expected.kind)return false;
  if(section.kind==='heading')return section.text==='';
  if(section.kind==='table')return Array.isArray(section.columns)&&JSON.stringify(section.columns)===JSON.stringify(expected.columns)&&Array.isArray(section.rows)&&section.rows.length<=500&&section.rows.every(row=>Array.isArray(row)&&row.length===section.columns.length&&row.every(cell=>typeof cell==='string'&&cell.length<=100000));
  return typeof section.text==='string'&&section.text.length<=100000;
 });
}
function updateControls(){
 $('connection').textContent=!connected?'Bağlantı yok · İnternet bağlantısı gerekli':!loaded?'Ortak form yükleniyor…':busy?'Firebase’e kaydediliyor…':'Canlı bağlantı etkin · Ortak form hazır';
 $('connection').className=connected?'connection':'connection connection-off';
 $('save').disabled=!connected||!loaded||busy;
 $('refresh').disabled=!remoteState||busy;
}
function markDirty(){dirty=true;setStatus('Kaydedilmemiş değişiklikler var.','warning')}
function render(openTitle=''){
 const root=$('sections');root.replaceChildren();
 working.sections.forEach((section,index)=>{
  if(section.kind==='heading'){root.append(el('h2',section.title,'section-heading'));return}
  const card=el('details',undefined,section.kind==='table'?'form-card table-card':'form-card');card.open=section.title===openTitle;
  card.append(el('summary',section.title));
  if(section.kind==='table'){
   const add=el('button','Satır ekle','button add-row');add.type='button';add.onclick=()=>{section.rows.push(section.columns.map(()=>''));markDirty();render(section.title)};card.append(add);
   const wrap=el('div',undefined,'table-wrap'),table=el('table',undefined,'entry-table'),head=el('tr');
   section.columns.forEach(label=>head.append(el('th',label)));head.append(el('th','İşlem'));const thead=el('thead');thead.append(head);table.append(thead);
   const tbody=el('tbody');
   section.rows.forEach((row,rowIndex)=>{
    const tr=el('tr');
    section.columns.forEach((label,columnIndex)=>{
     const td=el('td'),input=document.createElement('input');input.type='text';input.maxLength=100000;input.value=row[columnIndex]||'';input.setAttribute('aria-label',label+' · '+(rowIndex+1)+'. satır');
     if(section.fixedColumns?.includes(columnIndex)){input.readOnly=true;input.className='fixed-cell'}
     input.oninput=()=>{section.rows[rowIndex][columnIndex]=input.value;markDirty()};td.append(input);tr.append(td);
    });
    const td=el('td'),remove=el('button','Satırı sil','button remove-row');remove.type='button';remove.onclick=()=>{section.rows.splice(rowIndex,1);markDirty();render(section.title)};td.append(remove);tr.append(td);tbody.append(tr);
   });
   table.append(tbody);wrap.append(table);card.append(wrap);
  }else{
   const label=el('label','Bölüm metni','field'),textarea=document.createElement('textarea');textarea.id='field-'+index;textarea.maxLength=100000;textarea.value=section.text||'';label.htmlFor=textarea.id;textarea.oninput=()=>{section.text=textarea.value;markDirty()};label.append(textarea);card.append(label);
  }
  root.append(card);
 });
 updateControls();
}
async function initialize(){
 onValue(ref(db,'.info/connected'),snapshot=>{connected=snapshot.val()===true;updateControls()});
 try{
  await runTransaction(ref(db,path),current=>current===null?{formatVersion:FORM_VERSION,revision:1,updated:new Date().toISOString(),sections:clone(PROPOSAL_DEFAULT)}:undefined,{applyLocally:false});
  onValue(ref(db,path),snapshot=>{
   const value=snapshot.val();
   if(!validForm(value)){loaded=false;updateControls();setStatus('Ortak form verisi okunamadı. Mevcut veriler değiştirilmedi.','error');return}
   remoteState=value;
   if(!dirty){working=clone(value);revision=value.revision;loaded=true;render()}
   else if(value.revision!==revision)setStatus('Başka bir uzman formu güncelledi. Yazdıkların korunuyor; kaydetmeden önce güncel formu getir.','warning');
   loaded=true;updateControls();
  },()=>{loaded=false;updateControls();setStatus('Ortak form açılamadı. Firebase erişim kurallarını kontrol edin.','error')});
 }catch(error){loaded=false;updateControls();setStatus('Ortak form başlatılamadı. '+(error?.message||''),'error')}
}
$('save').onclick=async()=>{
 if(!working||!loaded||!connected||busy)return;
 busy=true;updateControls();const expected=revision,sections=clone(working.sections);
 try{
  const result=await runTransaction(ref(db,path),current=>{
   if(!validForm(current)||current.revision!==expected)return;
   return {...current,revision:expected+1,updated:new Date().toISOString(),sections};
  },{applyLocally:false});
  if(!result.committed){setStatus('Form başka bir uzman tarafından değiştirildi. Yazdıkların korundu; güncel formu getirip değişikliklerini yeniden uygula.','error');return}
  remoteState=result.snapshot.val();working=clone(remoteState);revision=remoteState.revision;dirty=false;render();setStatus('Form Firebase’e kaydedildi ve diğer uzmanlarla paylaşıldı.','success');
 }catch(error){setStatus('Kaydedilemedi. Yazdıkların korunuyor. '+(error?.message||''),'error')}
 finally{busy=false;updateControls()}
};
$('refresh').onclick=()=>{
 if(!remoteState)return;
 if(dirty&&!confirm('Kaydedilmemiş değişiklikler bırakılıp ortak form yeniden yüklensin mi?'))return;
 working=clone(remoteState);revision=remoteState.revision;dirty=false;render();setStatus('Güncel ortak form yüklendi.','success');
};
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue=''}});
initialize();

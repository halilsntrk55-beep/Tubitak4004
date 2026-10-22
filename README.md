# Jeoloji Proje Atölyesi — Canlı sürüm

Etkinlik önerileri, ekip tercihleri, saha planları ve 16 bölümlük proje planı Firebase Realtime Database üzerinde saklanır. İndirme, dosya içe aktarma, kayıt birleştirme ve yerel kayıt akışları kaldırılmıştır.

## Açılış

Bu depoyu GitHub Pages veya Vercel gibi bir hizmette statik site olarak yayımlayın ve ana adresini açın. Aynı Firebase e-posta/şifre hesabıyla giriş yapılır. Sayfa HTTP/HTTPS üzerinden sunulmalıdır; dosyaya çift tıklayarak açılması desteklenmez.

Veriler `egitim_ajandasi_v1/users/{uid}/jeoloji` yolundadır. Ajandanın `workspace` kaydı değişmez. Mevcut Firebase kuralları yalnızca sahibinin UID'sine izin verir; diğer öğretmenler kendi hesaplarıyla henüz erişemez.

## Davranış

- Başlangıçta 8 hazır etkinlik ve 16 bölüm yalnızca yeni çalışma alanı için eklenir.
- Kayıtlar kaydetme düğmesiyle doğrudan Firebase'e yazılır.
- Değişiklikler diğer açık cihazlarda anlık görünür.
- Bağlantı yoksa kayıt yapılmaz; yazılmamış form içeriği ekranda korunur.
- Aynı kayda eşzamanlı düzenleme yapılırsa sessizce üstüne yazılmaz, kullanıcıya bildirilir.
- Proje metni ile etkinlik kartları ayrı verilerdir; birbirlerini otomatik yeniden yazmazlar.

## Kontrol

JavaScript sözdizimi, Firebase oturumu, başlangıç kayıtları ve proje planının canlı kaydı tarayıcıda doğrulandı.

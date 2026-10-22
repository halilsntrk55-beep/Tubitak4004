# Jeoloji Proje Atölyesi

Linki açanlar e-posta ve şifre girmeden ortak Jeoloji çalışma alanına erişir. Etkinlikler, ekip tercihleri, saha planları ve 16 bölümlük proje metni aynı Firebase Realtime Database'de saklanır. İndirme, içe aktarma, yerel kayıt ve dosyayla birleştirme yoktur.

## Yayın

Depoyu statik site olarak yayımlayın. Giriş sayfası index.html dosyasıdır; app.js ve data.js aynı klasörde kalmalıdır. Dosyalar HTTP/HTTPS üzerinden sunulmalıdır.

## Firebase

Ortak veri yolu: egitim_ajandasi_v1/users/XTvKgz2yCoNs3c5v7628aZGAHxs1/jeoloji

Yalnızca bu Jeoloji yolunda oturumsuz okuma/yazma kuralı gerekir. Bu erişim etkinleştirildiğinde bağlantıyı bilen ziyaretçiler kayıtları görebilir, ekleyebilir, düzenleyebilir ve silebilir. Eğitim Ajandası'nın workspace yolu kendi hesap korumasını sürdürür.

Kayıt yazımı Firebase onayı geldikten sonra tamamlanır. Aynı kayda eşzamanlı değişiklikler sürüm kontrolüyle bildirilir; diğer cihazlardaki yenilikler anlık yansır.

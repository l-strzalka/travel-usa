## Moduł Newslettera (Double Opt-In Architecture)

Moduł zapisu do newslettera został zaprojektowany w oparciu o bezpieczny i zgodny z RODO wzorzec **Double Opt-In**, zintegrowany z zewnętrznym dostawcą usług e-mail marketingu (np. Brevo/Mailchimp).

### Architektura Przepływu Danych

[ Frontend: React 19 + Zod ]
│
▼  1. POST /api/v1/newsletter/subscribe { email, marketingConsent }
[ Backend: NestJS Controller + DTO ]
│
▼  2. Generowanie tokenu UUID & Zapis w bazie (Status: PENDING)
[ Database: MySQL via Prisma ]
│
▼  3. Zlecenie wysyłki maila aktywacyjnego z tokenem
[ Email Provider API (Transactional) ] ──> 📧 [ Skrzynka E-mail Klienta ]
│
┌───────────────────────────────────────┘
│  4. Kliknięcie w link: GET /api/v1/newsletter/confirm?token=XYZ
▼
[ Backend: NestJS Confirmation Endpoint ]
│
├─► 5. Weryfikacja tokena i zmiana statusu na CONFIRMED (Prisma)
│
└─► 6. Dodanie zweryfikowanego adresu do głównej listy dystrybucyjnej
[ Email Provider API (Marketing List) ]

### Dobre Praktyki & Bezpieczeństwo

1. **Idempotentność i obsługa duplikatów:** Ponowna próba zapisu istniejącego lub oczekującego na potwierdzenie adresu e-mail zwraca czytelny status biznesowy bez ujawniania informacji wrażliwych oraz bez rzucania błędów `500`.
2. **Ochrona przed botami (Rate Limiting):** Endpointy zapisu są zabezpieczone przed atakami typu Flood za pomocą mechanizmu Throttlera na backendzie (`429 Too Many Requests`).
3. **Izolacja odpowiedzialności (Separation of Concerns):**
   * **Baza MySQL (Prisma):** Przechowuje logi zgód marketingowych, znacznik czasu (audit log) oraz unikalne tokeny weryfikacyjne.
   * **Dostawca E-mail:** Odpowiada za dostarczalność wiadomości (SPF/DKIM/DMARC), obsługę jednoklikowych wypisów (`List-Unsubscribe`) oraz masowe kampanie e-mailowe.
4. **UX & Accessibility (a11y):** Formularz po stronie frontendu obsługuje walidację w locie (Zod), blokadę wielokrotnego wysłania (*double-submit prevention*), pelne sterowanie z klawiatury oraz dynamiczne stany ładowania i błędów (TanStack Query + MUI).

# WinForms Full Solution

WinForms web designer, C# PhoneBook-проекты и инструменты визуального сравнения интерфейсов.

## Состав

- `AGENTS.md`
- `CHECKLIST.md`
- `EXCLUSIONS.txt`
- `GEMINI_COMPARISON.md`
- `GEMINI_COVERAGE_PROMPT.md`
- `GEMINI_COVERAGE_RESULT.md`
- `PUBLICATION.md`
- `PhoneBook`/
- `PhoneBook-exported`/
- `PhoneBookPart3`/
- `REPORT.md`
- `add-fonts.py`
- `add-missing-fonts.py`
- `check-addform-final.py`
- `check-addform-precise.py`
- `check-addform-quick.py`
- `check-addform-round10.py`
- `check-addform.py`
- `check-all-gemini.py`
- `check-all-openrouter.py`
- `check-mainform-openrouter.py`
- `check-mainform-precise.py`
- `check-mainform-retry.py`
- `check-mainform.py`
- `check-part3.py`
- `check-searchname-correct.py`
- `check-searchname-gemini.py`
- `check-searchname-precise.py`
- `check-searchname.py`
- `check-statusstrip.mjs`

## Подготовка и запуск

Манифесты зависимостей в этой копии:
- [package.json](package.json)

Объявленные npm scripts: отсутствуют. Перед запуском проверьте `package.json`; установка и scripts при публикации не выполнялись.

Локальный веб-интерфейс: `npm install`, затем `node server.js`, адрес `http://localhost:8824/winforms.html`. Только доверенное локальное использование: backend работает с файлами, runtime выполняет обработчики. .NET-примеры требуют подходящего SDK/Windows и собственных настроек БД.

Не импортируйте и не запускайте незнакомые модули автоматически: возможны сетевые запросы, платежные операции и другие внешние эффекты. Отсутствующие данные, сервисы и конфигурацию нужно подготовить самостоятельно.

## Ограничения снимка

- Source snapshot; exclusions documented; runtime not certified.
- При оформлении репозитория приложение не развёртывалось, платежи и внешние API не запускались; тесты не перепроверялись.

## Происхождение и лицензии

Репозиторий оформлен из исходного ZIP портфолио Moon; это не восстановленная история разработки. Существующие LICENSE, notices и сведения об авторах сохранены. Новая лицензия не назначается; публичный доступ сам по себе не означает разрешение на произвольное использование.

Архив: `winforms-full-solution.zip`. SHA-256 исходного ZIP: `4263c6825ce2b8945ead68c6d92be78ba38092ee1adfb01f8d0d97d778e19d80`.

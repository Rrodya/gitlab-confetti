# Gitlab Confetti Effect

Расширение для браузера, которое добавляет эффект конфетти при нажатии кнопок `Approve` и `Merge` в GitLab.

## Установка в Google Chrome

1. Скачайте архив с расширением или клонируйте репозиторий
2. Откройте Google Chrome и перейдите в меню расширений:

   - Нажмите на три точки в правом верхнем углу браузера
   - Выберите "Дополнительные инструменты" -> "Расширения"
   - Или введите в адресной строке: `chrome://extensions/`

3. Включите "Режим разработчика" (переключатель в правом верхнем углу)

4. Нажмите кнопку "Загрузить распакованное расширение"

5. Выберите папку с расширением (должна содержать файлы `manifest.json`, `content.js` и другие необходимые файлы)

6. Расширение будет установлено и появится в списке расширений

7. Перейдите на любой merge request в GitLab и нажмите кнопки `Approve` или `Merge` - вы увидите эффект конфетти!

## Настройка для работы с другими доменами GitLab

По умолчанию расширение настроено для работы с официальным сайтом GitLab (gitlab.com). Если вам нужно, чтобы расширение работало на другом домене (например, на корпоративном GitLab), выполните следующие шаги:

1. Откройте файл `manifest.json`
2. Найдите секции `host_permissions`, `content_scripts.matches` и `web_accessible_resources.matches`
3. Замените URL `https://gitlab.com/*` на нужный вам домен (например, `https://gitlab.your-company.com/*`)
4. Перезагрузите расширение в браузере

Пример для корпоративного GitLab:

```json
"host_permissions": ["https://gitlab.your-company.com/*"],
"content_scripts": [
    {
        "matches": ["https://gitlab.your-company.com/*"],
        "js": ["assets/confetti.js", "content.js"],
        "css": ["styles.css"]
    }
],
"web_accessible_resources": [
    {
        "resources": ["assets/confetti-pop-sound.mp3", "assets/revoke-sound.mp3"],
        "matches": ["https://gitlab.your-company.com/*"]
    }
]
```

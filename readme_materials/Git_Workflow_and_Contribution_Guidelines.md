# <span style="color:orange"> Git Workflow & Contribution Guidelines</span>

## 1. Правила коммитов

### Формат сообщений:

`<тип>(<область>): <краткое описание> [Closes #<issue>]`

Примеры:

```
feat(auth): add JWT authentication Closes #45
fix(dashboard): resolve data caching issue Closes #78
docs(readme): update deployment instructions
perf(api): optimize response caching Closes #102
```

### Типы коммитов:

- `feat` - новая функциональность
- `fix` - исправление ошибок
- `docs` - изменения в документации
- `style` - форматирование, правки стиля
- `refactor` - изменения кода без изменения функционала
- `test` - добавление/изменение тестов
- `chore` - служебные задачи (обновление пакетов и т.д.)
- `perf` - оптимизация производительности

## 2. Ветки и их жизненный цикл

### Основные ветки:

1. `main` - стабильная production-версия
2. `dev` - текущая разработка (интеграционная ветка)

### Вспомогательные ветки:

- `feature/[ID-краткое-описание]` - разработка новой функциональности (например: `feature/WCS-FEAT-15-search-filter`)
- `bugfix/[ID-описание]` - исправление ошибок
- `hotfix/[ID-описание]` - срочные исправления в production
- `release/[версия]` - подготовка релиза (например: `release/v1.2.0`)

<span style="color:red"> **Важно:** </span>

- Все ID вида `WCS-FEAT-15` соответствуют трекеру задач
- Удаляйте ветку после успешного мержа в dev/main
- Для обновления веток используйте `rebase`:
    ```bash
    git fetch origin dev && git rebase origin/dev
    ```

## 3. Процесс слияния

### Для новых функциональностей:

1. Создать ветку от `dev`:  
   `git checkout -b feature/WCS-FEAT-15-search-filter dev`
2. Регулярно коммитить изменения
3. Перед слиянием:
    - Пройти код-ревью
    - Убедиться в успешности CI/CD
    - Обновить ветку через rebase с актуальным `dev`
4. Создать Pull Request в `dev`

### Для исправлений ошибок:

1. Для критических багов в production:

    - Создать ветку от `main`:  
      `git checkout -b hotfix/WCS-HOT-42-login-error main`
    - После исправления:
        - Слить в `main` и `dev` (используйте `cherry-pick` для dev)
        - Создать тег версии

2. Для обычных исправлений:
    - Создать ветку от `dev`:  
      `git checkout -b bugfix/WDB-BUG-21-table-render dev`
    - Слить через PR в `dev`

## 4. Процесс релиза

1. Создать ветку от `dev`:  
   `git checkout -b release/v1.2.0 dev`
2. Выполнить:
    - Финализацию документации
    - Деплой на staging для финального тестирования
    - Тегирование версии
3. Слить в `main` и `dev`:
    ```bash
    git checkout main
    git merge --no-ff release/v1.2.0
    git tag -a v1.2.0 -m "Release v1.2.0"  # или автоматизация через CI/CD
    git checkout dev
    git merge --no-ff release/v1.2.0
    ```

## 5. Контроль качества

- Запрещены прямые коммиты в `main` и `dev`
- Все изменения через Pull Request с:
    - Минимум 1 апрувером
    - Успешными тестами (coverage >80% для новых функций)
    - Проверкой линтером
    - Соответствием шаблону PR (см. раздел 7)
- Хотфиксы требуют:
    - Smoke-тест на staging
    - Подтверждение от тимлида

## 6. Исключения

- Экстренные исправления безопасности могут мержиться напрямую с:
    - Пост-фактум ревью в течение 24 часов
    - Уведомлением команды в Slack-канале
    - Коммитом вида: `fix(security): patch XSS vulnerability Closes #EMG-1`

## <span style="color:orange"> 7. Шаблоны Pull Request</span>

Добавьте в `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Описание изменений

- [ ] Тесты пройдены
- [ ] Документация обновлена
- [ ] Соответствует код-стайлу

Closes #<номер_задачи>

## Визуализация изменений

[Скриншоты/видео/схемы при необходимости]
```

## 8. Работа с зависимостями

- Обновление пакетов:
    ```bash
    chore(deps): upgrade axios to v2.0.0
    ```
- Мажорные изменения требуют:
    - Явного указания в теле коммита:
        ```bash
        BREAKING CHANGE: New authentication schema required
        ```
    - Обновления документации

## 9. Разрешение конфликтов

- При конфликтах во время rebase/merge:
    1. Разрешите конфликты локально
    2. Протестируйте изменения
    3. Зафиксируйте результат:
        ```bash
        fix(merge): resolve conflicts with dev
        ```

---

## Визуализация workflow

```
[Feature Branch] → PR → [Dev] → [Release Branch] → [Main]
                     ↗        ↘                ↘
[Hotfix Branch] → → →          → [Hotfix-Merge] → [Main]
```

---

Этот подход обеспечивает:

1. Сквозную трассировку изменений
2. Минимизацию конфликтов через rebase
3. Автоматизацию жизненного цикла задач

**Обязательные настройки:**

- GitHub Actions для:
    - Автоматического тегирования релизов
    - Проверки покрытия тестов
    - Линтинга кода
- Protected branches для main/dev
- Автоматическую генерацию changelog из семантических коммитов

<br/>
<br/>
<br/>

---

<br/>
<br/>
<br/>

# <span style="color:orange"> Рекомендуемая система префиксов</span>

```
[Проект]-[Тип задачи]-[ID]
```

### Примеры именования веток:

```bash
# Фича для сайта
git checkout -b feature/WCS-FEAT-15-user-auth

# Баг в дашборде
git checkout -b bugfix/WDB-BUG-42-chart-error

# Технический долг
git checkout -b refactor/WDB-TECH-33-query-optimization
```

### Правила:

1. **Проекты**:

    - `WCS` – Основной сайт
    - `WDB` – Дашборд

2. **Типы задач**:
    - `FEAT` – Новая функциональность
    - `BUG` – Исправление бага
    - `HOT` – Хотфикс
    - `TECH` – Технические задачи

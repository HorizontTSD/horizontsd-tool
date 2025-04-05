<!-- markdownlint-disable first-line-h1 -->
<!-- markdownlint-disable html -->
<!-- markdownlint-disable no-duplicate-header -->

<div align="center">
  <img src="/readme_materials/logo_line_white.svg" width="80%" alt="DeepSeek-V3" />
</div>
<hr>

[English description](#english-description) | [Русское описание](#русское-описание)

## English description
Welcome to the project!

## Русское описание
Добро пожаловать в проект!

## Оглавление

1. [Введение](#1-введение)
2. [Описание методологии](#2-описание-методологии)
3. [Оценка результатов](#3-оценка-результатов)
4. [Как запустить модель](#4-как-запустить-модель)
5. [Контакты](#5-контакты)


# 1. Введение
### Интеллектуальная система прогнозирования электропотребления

Наш проект — это инновационная платформа для прогнозирования временных рядов с применением глубокого обучения и искусственного интеллекта. Мы анализируем исторические данные, выявляем сезонные, погодные и операционные закономерности, обеспечивая точное предсказание.

Что делает нашу модель уникальной?

- Используем Time2Vec для более точного представления временных данных.

- Применяем гибридные архитектуры (LSTM, GRU, Transformers) для предсказания.

- Интегрируем систему с облачными сервисами и промышленными решениями.

Проблемы, которые решает проект:

Неточность прогнозов → снижение затрат и предотвращение энергетических дисбалансов.

Отсутствие оперативного мониторинга → автоматизированный анализ в реальном времени.

Сложность ML-решений → доступный инструмент для бизнеса и промышленности.

Проект разрабатывается как универсальная система, которую можно адаптировать для промышленности, медицины, анализа больших данных и других отраслей.

# 2. Описание методологии

### Основные принципы прогнозирования

Для построения модели прогнозирования временных рядов электропотребления используются современные методы машинного обучения и глубокого обучения. Ключевые алгоритмы включают LSTM, Bi-LSTM и XGBoost, которые позволяют выявлять сложные временные зависимости и нелинейные закономерности в данных.

### Подходы к обработке данных

- **Векторизация временных данных:** применяем модифицированный Time2Vec, что существенно повышает точность предсказаний по сравнению с традиционными методами.
- **Предобработка данных:** нормализация, очистка от выбросов, заполнение пропущенных значений, а также анализ сезонных и погодных факторов, влияющих на потребление электроэнергии.
- **Feature Engineering:** добавление признаков, учитывающих суточные интервалы, индикаторы рабочих часов и другие ключевые факторы, выявленные с помощью линейных и нелинейных зависимостей.

### Архитектура решения

Прогнозирование реализовано в облачной среде, что позволяет масштабировать систему и обрабатывать большие объемы данных в реальном времени. Основные компоненты архитектуры:

- **Модели прогнозирования:** гибридные нейросетевые архитектуры (CNN-LSTM, Bi-LSTM) в сочетании с градиентным бустингом (XGBoost).
- **Интерпретируемость модели:** используем методы объяснимого AI (XAI), что позволяет анализировать влияние различных факторов на прогноз.
- **Мониторинг и уведомления:** автоматическая система предупреждений при выявлении аномалий и критических изменений в потреблении.

### Удобство интеграции

- **Простота использования:** прогноз можно получить, загрузив данные в формате CSV, без необходимости писать код.
- **Совместимость:** поддержка интеграции с интеллектуальными счетчиками (smart meters) и IoT-устройствами для сбора данных в реальном времени.
- **Гибкость применения:** возможность адаптации к различным сферам, включая энергетику, промышленность, финансы и транспорт.

Разработанная система может быть интегрирована с отечественными облачными платформами (Яндекс Облако, VK Cloud, СберCloud), что делает ее коммерчески адаптивной и масштабируемой.

<p align="center">
  <img width="80%" src="horizontsd-info/readme_materials/Framework.png">
</p>

# 3. Оценка результатов

### Основные выводы экспериментов

В ходе сравнительного анализа проведённых экспериментов были сделаны следующие выводы:
- Точно предсказать потребление электроэнергии на основе только исторических данных довольно сложно. Однако добавление дополнительных слоёв, таких как сверточные (CNN) или двунаправленные LSTM (Bi-LSTM), значительно улучшает точность.
- Включение новых признаков — это ключ к улучшению прогноза. Особенно важно добавить временные метаданные (например, информацию о датах). Даже простая модель LSTM с этими признаками уже даёт хорошие результаты.
- Параметры погоды, особенно температура окружающей среды, оказывают большое влияние на точность прогнозов. Это подтвердили как корреляционный анализ, так и результаты тестов моделей.
- Совмещение временных метаданных и погодных данных даёт наилучшую точность.

### Визуализация результатов

- В данной таблице отображены результаты прогнозирования нагрузки на сутки вперед с использованием температуры окружающей среды и временных метаданных.

<p align="center">
  <img width="80%" src="/horizontsd-tool/readme_materials/Table.png">
</p>

- На данном графике изображен временной ряд прогнозирования электропотребления на сутки вперед с с использованием температуры окружающей среды и временных метаданных.

<p align="center">
  <img width="80%" src="horizontsd-info/readme_materials/Case_D.png">
</p>

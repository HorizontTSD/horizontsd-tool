# horizontsd-tool

<p align="center">

[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)
![Code Coverage](coverage.svg)

</p>

# Запуск на своей машине

#### Установка зависимостей
```bash

```


Активация окружения
```bash

```


Запуск на своей машине
```bash

```



# Запуск контейнера локально

### Строим контейнер
```bash
sudo docker build -t horizon_tool .
```
Узнаем его ID
```bash
sudo docker images
```

```bash
sudo docker run -d -p 7070:7071 <IMAGE ID>
```

# Запуск контейнера публично

### Строим контейнер
```bash
sudo docker build -t  .
```
Узнаем его IMAGE ID
```bash
sudo docker images
```

```bash
docker run -d -p 7070:7070 <IMAGE ID>
```

```bash
docker run -d -p 80:7070 <IMAGE ID>
```

```bash
docker run -d -p 7070:80 <IMAGE ID>
```


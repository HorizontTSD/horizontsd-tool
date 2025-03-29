# horizontsd-tool

<p align="center">

[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)
![Code Coverage](coverage.svg)

</p>

# Для запуска в собранном режиме

cd dist
serve .

# Запуск контейнера локально

### Строим контейнер

```bash
sudo docker build -t horizon_tool-frontend .
```

Узнаем его ID

```bash
sudo docker images
```

```bash
sudo docker run -d -p 5173:5173 <IMAGE ID>
```

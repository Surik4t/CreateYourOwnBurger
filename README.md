# Create Your Own Burger pet-project

Create Your Own Burger - это веб-приложение, онлайн-конструктор бургеров с возможностью последующего заказа.  
Пользовательский интерфейс позволяет настраивать состав бургера из доступных ингредиентов, каждый выбор мгновенно отражается на итоговой стоимости и визуальном отображении блюда.  

Попробовать приложение можно [тут](https://create-your-own-burger-surik4t.netlify.app/login).
> Может понадобиться VPN или [WARP](https://one.one.one.one)  

## Tech Stack  
### Backend  
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=flat&logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)

### Frontend  
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-319795?style=flat&logo=chakra-ui&logoColor=white)](https://chakra-ui.com/)

## Локальный запуск проекта
### Предварительные требования
*   [Git](https://git-scm.com/)
*   [Node.js](https://nodejs.org/) и npm (устанавливается вместе с Node.js)
*   [Python](https://www.python.org/) 3.13+
*   [MongoDB](https://www.mongodb.com/try/download/community) (запущенный сервер на `localhost:27017`)
*   (Опционально) [RabbitMQ](https://www.rabbitmq.com/download.html) и настроенный SMTP аккаунт для отправки email

1. ### Клонируем репозиторий
```
git clone https://github.com/Surik4t/CreateYourOwnBurger.git
cd CreateYourOwnBurger/
```

2. ### Настраиваем backend
* Устанавливаем зависимости  
```
cd backend/
pip install -r reqs.txt
```
* Инициализируем базу данных
```
python database/db_init.py
```
* В папке backend создаем и заполняем файл .env по образцу ниже:
```
JWT_SECRET_KEY=СекретныйКлючДляТокенаАвторизации

DB_HOST=mongodb://localhost:27017

# Опционально 
SMTP_SERVER=SMTP_Сервер
SMTP_PORT=465
SMTP_EMAIL=АдресЭлектроннойПочты
SMTP_PASSWORD=ПарольОтЭлектроннойПочты
```  
* Запускаем Backend
```
python main.py
```  
Если все шаги были сделаны правильно, API документация будет доступна по адресу http://localhost:8000/docs  
А по запросу http://localhost:8000/ingredients должен отобразиться список ингредиентов  

3. ### Настраиваем Frontend
* В новом окне терминала, из корневой папки проекта переходим в директорию клиентской части приложения и устанавливаем зависимости 
```
cd ../frontend/
npm install
```
* Запускаем Frontend  
```
npm run dev
```
Приложение будет доступно по адресу http://localhost:5173/  

Приложением уже можно пользоваться через гостевой аккаунт, но для регистрации нового аккаунта, необходимо активировать скрипт для отправки сообщений на электронную почту:  
В новом окне терминала, из корневой папки проекта запускаем скрипт - `python ./backend/app/RabbitMQ/Message_receiver.py`


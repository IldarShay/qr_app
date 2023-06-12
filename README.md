# qr_app

Приложение имеет 2 состояния - "авторизация" и "карта". При переходе пользователя на неопределенное состояние приложение переходит на состояние “карта”, если пользователь авторизован, иначе - на состояние “авторизация”.

Авторизация
Единственное доступное состояние для неавторизованного пользователя. Шаблон состояния имеет форму с 2 инпутами (логин и пароль) и кнопку "Войти".

Карта
Единственное доступное состояние для авторизованного пользователя. Шаблон состояния имеет кнопку “Выйти” и карту, на которой отмечены точки, куда агент поставляет товар. Точки формируются из модели (model.js)

Пользователь может создавать новые точки (dblclick), удалять существующие и редактировать все их свойства. Изменения записываются в текущую модель.

Дополнительно реализованы:

- возможность сбросить изменения модели
- возможность перемещения точек

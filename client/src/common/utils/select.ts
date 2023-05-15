export const departments = [
  {id: 0, name: 'Магазин'},
  {id: 1, name: 'АЦД'},
  {id: 2, name: 'ОСФ'},
  {id: 3, name: 'Отдел общественного питания'},
  {id: 4, name: 'Отдел технического обслуживания (Самал)'},
  {id: 5, name: 'Отдел технического обслуживания (Завод)'},
  {id: 6, name: 'Отдел хозяйственного обслуживания (Завод)'},
]

export const statuses = (permissions: string) => {
  const disabled = permissions === 'top'
  return [
  {id: 0, name: 'Открыта', disabled: disabled },
  {id: 1, name: 'На согласовании', disabled: disabled},
  {id: 2, name: 'Согласовано'},
  {id: 3, name: 'Поиск поставщика', disabled: disabled},
  {id: 4, name: 'На доставке', disabled: disabled},
  {id: 5, name: 'Не согласовано'},
  {id: 6, name: 'Отменена', disabled: disabled},
  {id: 7, name: 'Закрыта', disabled: disabled},
]}

export const roles = [
  {id: 'admin', name: 'Администратор'},
  {id: 'manager', name: 'Руководитель'},
  {id: 'purchaser', name: 'Закупщик'},
  {id: 'top', name: 'Топ-менеджер'},
]

export const rolesList = [
  'admin', 'manager', 'purchaser', 'top',
]
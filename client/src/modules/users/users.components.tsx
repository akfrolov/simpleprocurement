import {
  Datagrid,
  EditButton,
  EmailField,
  List,
  NumberField,
  TextField,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
  Create, useRecordContext, ReferenceInput, SelectField, SelectInput, PasswordInput, downloadCSV,
} from "react-admin";
import {departments, roles, statuses} from "../../common/utils/select";
import jsonExport from "jsonexport/dist";

async function exporter (
  records: Record<string, any>[],
  fetchRelatedRecords: (
    data: any,
    field: string,
    resource: string
  ) => Promise<any>) {
  records = records.map(record => {
    record.department = departments.find(department => department.id === record.department)?.name;
    record.role = roles.find(role => role.id === record.role)?.name;

    delete record._id;
    delete record.__v;

    return record;
  });

  const columns = new Map([
    ['id', "ID"],
    ['name', "Имя"],
    ['email', 'Почта'],
    ['role', 'Роль'],
    ['department', "Отдел"],
  ])

  jsonExport(records, {
    headers: Array.from(columns.keys()),
    rename: Array.from(columns.values()),
  }, (err, csv) => {
    downloadCSV(csv, 'users');
  });
};

export const UserList = () => (
  <List exporter={exporter} filters={postFilters} title={"Пользователи"}>
    <Datagrid rowClick="edit">
      {/*<TextField source="id" />*/}
      <TextField source="name" label={"Имя"}/>

      <EmailField source="email" label={"Почта"}/>

      {/*<TextField source="password"/>*/}

      <SelectField choices={roles} source={'role'} label={"Роль"}/>

      <SelectField source="department" choices={departments} label={"Отдел"} />

      <EditButton/>
    </Datagrid>
  </List>
);

const UserTitle = () => {
  const record = useRecordContext();
  return <span>Пользователь {record ? `"${record.name}"` : ''}</span>;
};

const postFilters = [
  <TextInput source="q" label="Поиск" alwaysOn/>,
  <SelectInput choices={roles} label="Роль" source={'role'}/>,
  <SelectInput choices={departments} label="Подразделение" source={'department'}/>,
];

export function UserForm() {
  return <SimpleForm>
    {/*<TextInput source="id" />*/}
    <TextInput source="name" label={"Имя"} required />
    <TextInput source="email" label={"Почта"} required />
    <PasswordInput source="password" label={"Пароль"} required />
    <SelectInput choices={roles} source={'role'} label={"Роль"} required/>
    <SelectInput choices={departments} source={'department'} label={"Отдел"} required/>
  </SimpleForm>
}

export const UserEdit = () => (
  <Edit title={<UserTitle/>}>
    <UserForm/>
  </Edit>
);

export const UserCreate = () => (
  <Create>
    <UserForm/>
  </Create>
)
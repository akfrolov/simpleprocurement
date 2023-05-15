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
  Create, useRecordContext, ReferenceInput, SelectField, SelectInput, PasswordInput,
} from "react-admin";
import {departments, roles} from "../../common/utils/select";

export const UserList = () => (
  <List filters={postFilters} title={"Пользователи"}>
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
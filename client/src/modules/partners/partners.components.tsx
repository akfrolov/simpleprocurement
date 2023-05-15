import {
  Create,
  Datagrid, Edit,
  List,
  PasswordInput,
  SelectInput,
  SimpleForm,
  SimpleList,
  TextField,
  TextInput,
  useRecordContext
} from 'react-admin';
import {departments, roles} from "../../common/utils/select";

export const PartnerList = () => (
  <List title={'Партнеры'} filters={partnerFilters}>
    <SimpleList
      primaryText={(record) => record.title}
      secondaryText={(record) => record.rep}
      tertiaryText={(record) => record.contacts}
    />
    {/*<Datagrid rowClick="edit">*/}
    {/*  /!*<TextField source="id" />*!/*/}
    {/*  <TextField source="title" />*/}
    {/*  <TextField source="rep" />*/}
    {/*  <TextField source="contacts" />*/}
    {/*</Datagrid>*/}
  </List>
);

const PartnerTitle = () => {
  const record = useRecordContext();
  return <span>Партнер {record ? `"${record.title}"` : ''}</span>;
};

const partnerFilters = [
  <TextInput source="q" label="Поиск" alwaysOn />,
];

export function PartnerForm() {
  return <SimpleForm>
    <TextInput source="title" label={"Название"} name={"title"} required/>
    <TextInput source="rep" label={"Представитель"} name={"rep"}/>
    <TextInput source="contacts" label={"Контакты"} name={"contacts"} required/>
  </SimpleForm>
}

export const PartnerEdit = () => (
  <Edit title={<PartnerTitle/>}>
    <PartnerForm/>
  </Edit>
);

export const PartnerCreate = () => (
  <Create>
    <PartnerForm/>
  </Create>
)
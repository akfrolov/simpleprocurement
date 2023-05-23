import {
  Create,
  Datagrid, downloadCSV, Edit,
  List,
  PasswordInput,
  SelectInput,
  SimpleForm,
  SimpleList,
  TextField,
  TextInput,
  useRecordContext
} from 'react-admin';
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
    delete record._id;
    delete record.__v;

    return record;
  });

  const columns = new Map([
    ['id', "ID"],
    ['title', "Название"],
    ['contacts', 'Контакты'],
    ['rep', 'Представитель'],
  ])

  jsonExport(records, {
    headers: Array.from(columns.keys()),
    rename: Array.from(columns.values()),
  }, (err, csv) => {
    downloadCSV(csv, 'partners');
  });
};

export const PartnerList = () => (
  <List exporter={exporter} title={'Партнеры'} filters={partnerFilters}>
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
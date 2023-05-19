import {
  AutocompleteInput,
  Button,
  CloneButton,
  Create,
  Datagrid,
  DateField,
  DateInput,
  Edit,
  EditButton,
  Link,
  List,
  ListButton,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  ReferenceManyField,
  RefreshButton,
  required,
  SelectArrayInput,
  SelectField,
  SelectInput,
  Show,
  SimpleForm,
  TabbedShowLayout,
  TextField,
  TextInput,
  TopToolbar,
  usePermissions,
  useRecordContext
} from "react-admin";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import {departments, statuses} from "../../common/utils/select";
import {localStorageKey} from "../../common/utils/auth-provider";
import {ListImage} from "../goods/goods.components";

export const RequestList = () => {
  const {permissions} = usePermissions();
  const localData = localStorage.getItem(localStorageKey);
  const identity = JSON.parse(localData!);
  return <List
    title={<RequestTitle/>}
    filters={requestFilters(permissions)}
    filter={permissions === "manager" ? {initiator: identity.id} : undefined}
    filterDefaultValues={{status: [0, 1, 2, 3, 4, 5]}}
  >
    <Datagrid rowClick="show">
      {/*<TextField source="id" />*/}
      <TextField source="identifier" label={"Номер"}/>

      <DateField source="issueDate" label={"Дата выпуска"}/>


      {permissions !== "manager" && <ReferenceField source="initiator" reference="users" label={"Инициатор"}/>}

      <ReferenceField source="supplier" reference="partners" label={"Поставщик"}/>

      <TextField source="title" label={"Наименование"}/>

      <NumberField source="orderQuantity" label={"Кол-во заказано"}/>

      <SelectField source="status" choices={statuses('all')} label={"Статус"}/>

      <DateField source="deliveryPlanned" label={"Планируемая дата поставки"}/>

      <TextField source="project" label={"Проект"}/>

      <TextField source="shortDescription" label={"Краткое описание"}/>

      <SelectField source="department" choices={departments} label={"Отдел"}/>
    </Datagrid>
  </List>;
};

const requestFilters = (permissions: string) => {
  const filters = [
    <TextInput source="q" label="Поиск" alwaysOn/>,
    <ReferenceInput source="supplier" reference="partners" label={"Поставщик"}>
      <AutocompleteInput label="Поставщик"/>
    </ReferenceInput>,
    <SelectArrayInput source="status" choices={statuses('all')} label={"Статус"}/>,
    <SelectInput choices={departments} source={"department"} label={"Отдел"}/>,
    <DateInput source={"issueDate"} label={"Дата выпуска"}/>,
    <DateInput source="deliveryPlanned" label={"Планируемая дата поставки"}/>
  ];
  if (permissions !== "manager") filters.push(
    <ReferenceInput source="initiator" reference="users" label={"Инициатор"}>
      <AutocompleteInput label="Инициатор"/>
    </ReferenceInput>
  );
  return filters;
};

// const StatusInput = (props: InputProps<any>) => {
//   const { permissions } = usePermissions();
//   // const localData = localStorage.getItem(localStorageKey);
//   // const identity = JSON.parse(localData!);
//
//   const {
//     field,
//     fieldState: { isTouched, invalid, error },
//     formState: { isSubmitted }
//   } = useInput(props);
//
//   return (
//     <MuiTextField
//       select
//       required
//       label="Статус"
//       fullWidth
//       sx={{marginBottom: '1.5rem'}}
//       {...field}
//     >
//       {statuses.map((option) => {
//         let disabled = false;
//         if (permissions !== ('top' && 'admin')) {
//           if (!field.value || field.value < 2) {
//             disabled = option.id >= 2;
//           } else {
//             disabled = option.id < 2;
//           }
//         }
//         return <MenuItem key={option.id} value={option.id} disabled={disabled}>
//           {option.name}
//         </MenuItem>;
//       })}
//     </MuiTextField>
//   );
// };

export function RequestForm() {
  const {permissions} = usePermissions();
  const localData = localStorage.getItem(localStorageKey);
  const identity = JSON.parse(localData!);
  return <SimpleForm>
    <TextInput source="identifier" label={"Номер"} disabled fullWidth/>
    <DateInput source="issueDate" label={"Дата выпуска"} required fullWidth/>
    <ReferenceInput
      source="initiator"
      reference="users"
      label={"Инициатор"}
      fullWidth
    >
      <AutocompleteInput
        shouldRenderSuggestions={() => permissions !== "manager"}
        defaultValue={identity.id}
        disabled={permissions === "manager"}
        label="Инициатор"
        validate={required()}
        fullWidth
      />
    </ReferenceInput>
    <ReferenceInput source="supplier" reference="partners" label={"Поставщик"} fullWidth>
      <AutocompleteInput label="Поставщик" fullWidth/>
    </ReferenceInput>
    <TextInput source="title" label={"Наименование"} required fullWidth/>
    <NumberInput source="orderQuantity" label={"Кол-во заказано"} required fullWidth/>

    {/*<StatusInput validate={required()} source={'status'} label={"Статус"} />*/}
    <SelectInput defaultValue={0} disabled={permissions === 'manager'} choices={statuses(permissions)} source={"status"}
                 label={"Статус"} required fullWidth/>

    <DateInput source="deliveryPlanned" label={"Планируемая дата поставки"} required fullWidth/>
    <TextInput source="project" label={"Проект"} required fullWidth/>
    <TextInput source="shortDescription" label={"Краткое описание"} multiline fullWidth/>
    <SelectInput choices={departments} source={"department"} label={"Отдел"} required fullWidth/>
  </SimpleForm>;
}

export const RequestEdit = () => (
  <Edit title={<RequestTitle/>}>
    <RequestForm/>
  </Edit>
);

export const RequestCreate = () => (
  <Create>
    <RequestForm/>
  </Create>
);

const AddGoodsButton = () => {
  const record = useRecordContext();

  return (
    <Button
      startIcon={<AddIcon/>}
      variant="contained"
      component={Link}
      to={{
        pathname: "/goods/create",
        // Here we specify the initial record for the create view
        state: {record: {request: record.id}}
      }}
      label="Добавить товар"
    />
    // {/*<ChatBubbleIcon />*/}
    // {/*</Button>*/}
  );
};

const RequestShowActions = () => (
  <TopToolbar>
    <EditButton/>
    <RefreshButton/>
    <CloneButton/>
    <ListButton/>
  </TopToolbar>
);

const RequestTitle = () => {
  const record = useRecordContext();
  return <span>Заявка {record ? `"${record.identifier}"` : ""}</span>;
};


export const RequestShow = () => {
  const {permissions} = usePermissions();
  return <Show title={<RequestTitle/>} actions={<RequestShowActions/>}>
    <TabbedShowLayout>
      <TabbedShowLayout.Tab label="Обзор">
        <TextField source="identifier" label={"Номер"}/>
        <DateField source="issueDate" label={"Дата выпуска"}/>
        <ReferenceField source="initiator" reference="users" label={"Инициатор"}/>
        <TextField source="title" label={"Наименование"}/>
        <NumberField source="orderQuantity" label={"Кол-во заказано"}/>
        <DateField source="deliveryPlanned" label={"Планируемая дата поставки"}/>
        <TextField source="project" label={"Проект"}/>
        <TextField source="shortDescription" label={"Краткое описание"}/>
        <SelectField source="department" choices={departments} label={"Отдел"}/>
        <SelectField source="status" choices={statuses('all')} label={"Статус"}/>
      </TabbedShowLayout.Tab>

      <TabbedShowLayout.Tab label="Товары">
        <ReferenceManyField label="Товары" reference="goods" target="request">
          <Datagrid>
            <ListImage/>
            <TextField source="title" label={"Название"}/>
            <NumberField source="quantity" label={"Кол-во"}/>
            <TextField source="units" label={"Ед. изм."}/>
            <TextField source="notes" label={"Заметки"}/>
            <NumberField source="stockQuantity" label={"Кол-во на складе"}/>
            <EditButton/>
          </Datagrid>
        </ReferenceManyField>

        <Box>
          <AddGoodsButton/>
        </Box>
      </TabbedShowLayout.Tab>
    </TabbedShowLayout>
  </Show>;
}


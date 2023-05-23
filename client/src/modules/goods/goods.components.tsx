import {
  AutocompleteInput,
  Button,
  Create,
  Datagrid,
  DeleteButton,
  downloadCSV,
  Edit,
  ImageField,
  ImageInput,
  Link,
  List,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  required,
  SaveButton,
  SimpleForm,
  TextField,
  TextInput,
  Toolbar,
  usePermissions,
  useRecordContext
} from "react-admin";
import RequestIcon from "@mui/icons-material/RequestQuote";
import Stack from "@mui/material/Stack";
import React from "react";
import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";
import {localStorageKey} from "../../common/utils/auth-provider";
import jsonExport from 'jsonexport/dist';

const goodsFilters = [
  <TextInput source="search" label="Поиск" alwaysOn/>,
  <ReferenceInput source="request" reference="requests" label={'Заявка'}>
    <AutocompleteInput label="Заявка"/>
  </ReferenceInput>,
];

export const ListImage = () => {
  const {images} = useRecordContext();
  return images.length > 0 ?
    <StyledBox>
      <img
        title={images[0].title}
        alt={images[0].title}
        src={images[0].src}
        className={'CustomImage'}
      />
    </StyledBox> : null;
}

const StyledBox = styled(Box, {
  name: 'CustomImageField', //PREFIX,
  // overridesResolver: (props, styles) => styles.root,
})({
  [`& .CustomList`]: {
    display: 'flex',
    listStyleType: 'none',
  },
  [`& .CustomImage`]: {
    margin: '0.25rem',
    width: 200,
    height: 100,
    objectFit: 'contain',
  },
});


async function exporter (
  records: Record<string, any>[],
  fetchRelatedRecords: (
    data: any,
    field: string,
    resource: string
  ) => Promise<any>) {

  let requests = await fetchRelatedRecords(records, 'request', 'requests');

  records = records.map(record => {
    if (requests[record.request]) {
      record.requestTitle = requests[record.request].title;
      record.initiator = requests[record.request].initiator;

      record.request = requests[record.request].identifier;
    }

    delete record._id;
    delete record.__v;

    if (record.images.length > 0) record.image = {src: record.images[0].src, title: record.images[0].title}
    delete record.images;

    return record;
  });

  const initiators = await fetchRelatedRecords(records, 'initiator', 'users');
  records = records.map((record) => {
    if (initiators[record.initiator]) {
      record.initiator = initiators[record.initiator].name;
    }

    return record;
  })


  const columns = new Map([
    ['id', "ID"],
    ['title', 'Название'],
    ['quantity', 'Кол-во'],
    ['units', "Ед. изм."],
    ['notes', "Заметки"],
    ['stockQuantity', "Кол-во на складе"],
    ['request', "Заявка"],
    ['requestTitle', 'Название заявки'],
    ['image.src', "Ссылка на изображение"],
    ['image.title', "Название изображения"],
    ['initiator', "Инициатор"],
  ])

  jsonExport(records, {
    headers: Array.from(columns.keys()),
    rename: Array.from(columns.values()),
  }, (err, csv) => {
    downloadCSV(csv, 'goods');
  });
};

export const GoodsList = () => {
  const {permissions} = usePermissions();
  const localData = localStorage.getItem(localStorageKey);
  const identity = JSON.parse(localData!);

  return <List
    exporter={exporter}
    filters={goodsFilters}
    filter={permissions === "manager" ? {initiator: identity.id} : undefined}
  >
    <Datagrid rowClick="edit">
      <ListImage/>
      {/*<ImageField  source="images" src={"src"} title={"title"} label={"Изображения"} />*/}
      <TextField source="title" label={"Название"}/>
      <NumberField source="quantity" label={"Кол-во"}/>
      <TextField source="units" label={"Ед. изм."}/>
      <TextField source="notes" label={"Заметки"}/>
      <NumberField source="stockQuantity" label={"Кол-во на складе"}/>
      <ReferenceField source="request" reference="requests" label={"Заявка"}/>
    </Datagrid>
  </List>;
};

const AddGoodsButton = () => {
  const record = useRecordContext();
  console.log('record', record)

  return (record && record.request) ? (
    <Button
      startIcon={<RequestIcon/>}
      variant="contained"
      component={Link}
      to={{
        pathname: `/requests/${record.request}/show/1`,
        // Here we specify the initial record for the create view
        // state: { record: { requestId: record.id } },
      }}
      label="К заявке"
    />
    // {/*<ChatBubbleIcon />*/}
    // {/*</Button>*/}
  ) : null;
};

const GoodsFormToolbar = (props: JSX.IntrinsicAttributes) => (
  <Toolbar {...props}  >
    <Stack
      direction={"row"}
      flex={"auto"}
      spacing={2}
      // gap={2}
    >
      <SaveButton/>
      <AddGoodsButton/>
    </Stack>

    <DeleteButton/>
  </Toolbar>
);

export const GoodsForm = () => {
  const record = useRecordContext();
  console.log(record)
  return <SimpleForm toolbar={<GoodsFormToolbar/>}>
    {/*<ImageField source="images" src={'src'} title={'title'} label={"Изображения"} />*/}
    <ImageInput source="images" label="Изображение" accept="image/*" multiple={true}>
      <ImageField source="src" title={'title'}/>
    </ImageInput>
    <TextInput source="title" label={"Название"} required/>
    <NumberInput source="quantity" label={"Кол-во"} required/>
    <TextInput source="units" label={"Ед. изм."}/>
    <TextInput source="notes" label={"Заметки"} multiline/>
    <NumberInput source="stockQuantity" label={"Кол-во на складе"}/>
    <ReferenceInput source="request" reference="requests" label={"Заявка"}>
      <AutocompleteInput label="Заявка" validate={required()}/>
    </ReferenceInput>
  </SimpleForm>
}


export const GoodsEdit = () => (
  <Edit>
    <GoodsForm/>
  </Edit>
);

export const GoodsCreate = () => (
  <Create>
    <GoodsForm/>
  </Create>
);
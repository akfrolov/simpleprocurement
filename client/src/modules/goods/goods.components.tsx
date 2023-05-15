import {
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  Create,
  AutocompleteInput,
  useRecordContext,
  SaveButton,
  Toolbar,
  DeleteButton,
  Button,
  Link, required, ImageInput, ImageField
} from "react-admin";
import {departments, statuses} from "../../common/utils/select";
import RequestIcon from "@mui/icons-material/RequestQuote";
import Stack from "@mui/material/Stack";
import React from "react";

const goodsFilters = [
  <TextInput source="search" label="Поиск" alwaysOn/>,
  <ReferenceInput source="requestId" reference="requests" label={'Заявка'}>
    <AutocompleteInput label="Заявка" />
  </ReferenceInput>,
];

const ListImage = () => {
  const { images } = useRecordContext();
  return images.length > 0 ? <div className={'MuiBox-root css-cb34tx-RaImageField-root'}>
    <img
      className={'RaImageField-image'}
      alt={images[0].title}
      src={images[0].src}
      title={images[0].title}
    />
  </div> : null;
}

export const GoodsList = () => {
  return <List filters={goodsFilters}>
    <Datagrid rowClick="edit">
      <ListImage/>
      {/*<ImageField source="images" src={"src"} title={"title"} label={"Изображения"} />*/}
      <TextField source="title" label={"Название"} />
      <NumberField source="quantity" label={"Кол-во"} />
      <TextField source="units" label={"Ед. изм."} />
      <TextField source="notes" label={"Заметки"} />
      <NumberField source="stockQuantity" label={"Кол-во на складе"} />
      <ReferenceField source="request" reference="requests" label={"Заявка"} />
    </Datagrid>
  </List>;
};

const AddGoodsButton = () => {
  const record = useRecordContext();
  console.log('record',record)

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
      <SaveButton />
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
    <ImageInput source="images" label="Изображение"  accept="image/*" multiple={true}>
      <ImageField source="src" title={'title'} />
    </ImageInput>
    <TextInput source="title" label={"Название"} required />
    <NumberInput source="quantity" label={"Кол-во"} required />
    <TextInput source="units" label={"Ед. изм."} required/>
    <TextInput source="notes" label={"Заметки"} required/>
    <NumberInput source="stockQuantity" label={"Кол-во на складе"} />
    <ReferenceInput source="request" reference="requests" label={"Заявка"} >
      <AutocompleteInput label="Заявка"  validate={required()}/>
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
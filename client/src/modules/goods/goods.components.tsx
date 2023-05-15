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
import RequestIcon from "@mui/icons-material/RequestQuote";
import Stack from "@mui/material/Stack";
import React from "react";
import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const goodsFilters = [
  <TextInput source="search" label="Поиск" alwaysOn/>,
  <ReferenceInput source="requestId" reference="requests" label={'Заявка'}>
    <AutocompleteInput label="Заявка" />
  </ReferenceInput>,
];

const ListImage = () => {
  const { images } = useRecordContext();
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

export const GoodsList = () => {
  return <List filters={goodsFilters}>
    <Datagrid rowClick="edit">
      <ListImage/>
      {/*<ImageField  source="images" src={"src"} title={"title"} label={"Изображения"} />*/}
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
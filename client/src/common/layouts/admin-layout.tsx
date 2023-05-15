import {AppBar, Layout, LayoutProps, TitlePortal} from 'react-admin';
// import { Typography } from '@mui/material';
// import logo from '../../../public/logo-white.svg'
// import { ReactQueryDevtools } from 'react-query/devtools';
const CustomAppBar = () => <AppBar color="primary">
  <TitlePortal />
  <img src={'/logo-white.svg'}/>
</AppBar>;


export const CustomLayout = (props: JSX.IntrinsicAttributes & LayoutProps) =>
  <>
    <Layout {...props} appBar={CustomAppBar}/>
    {/*<ReactQueryDevtools initialIsOpen={false} />*/}
  </>

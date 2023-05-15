import { Admin, Resource, withLifecycleCallbacks } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { UserCreate, UserEdit, UserList } from "./modules/users";
import { PartnerList } from "./modules/partners";
import { RequestList } from "./modules/requests";
// @ts-ignore
import ru from "ra-language-russian";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { themeOptions } from "./common/utils";
import { CustomLayout } from "./common/layouts";
import UserIcon from "@mui/icons-material/SupervisedUserCircle";
import PartnerIcon from "@mui/icons-material/ContactPhone";
import RequestIcon from "@mui/icons-material/RequestQuote";
import GoodsIcon from "@mui/icons-material/Inventory";
import { PartnerCreate, PartnerEdit } from "./modules/partners/partners.components";
import { RequestCreate, RequestEdit, RequestShow } from "./modules/requests/requests.components";
import { GoodsCreate, GoodsEdit, GoodsList } from "./modules/goods/goods.components";
import customDataProvider from "./common/utils/data-provider";
import authProvider from "./common/utils/auth-provider";

export const i18nProvider = polyglotI18nProvider(() => ru, "ru");
const dataProvider = jsonServerProvider("http://localhost:3001");

export const enhancedDataProvider = withLifecycleCallbacks(customDataProvider, [
  {
    resource: 'requests',
    beforeDelete: async (params, dataProvider) => {
      // delete all comments related to the post
      // first, fetch the comments
      const { data: comments } = await dataProvider.getList('comments', {
        filter: { post_id: params.id },
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'id', order: 'DESC' },
      });
      // then, delete them
      await dataProvider.deleteMany('comments', { ids: comments.map(comment => comment.id) });

      return params;
    },
  },
]);


const App = () => <Admin
  dataProvider={customDataProvider}
  authProvider={authProvider}
  i18nProvider={i18nProvider}
  title={"Управление закупками"}
  theme={themeOptions}
  layout={CustomLayout}
  disableTelemetry
  // basename={''}
  requireAuth
>
  {permissions => (
    <>
      <Resource
        name="requests"
        options={{
          label: "Заявки"
        }}
        icon={RequestIcon}
        list={RequestList}
        recordRepresentation={"identifier"}
        edit={RequestEdit}
        create={RequestCreate}
        show={RequestShow}
      />

      <Resource
        name="goods"
        options={{
          label: "Товары"
        }}
        icon={GoodsIcon}
        list={GoodsList}
        recordRepresentation={"title"}
        edit={GoodsEdit}
        create={GoodsCreate}
      />

      <Resource
        name="partners"
        options={{
          label: "Контрагенты"
        }}
        icon={PartnerIcon}
        list={PartnerList}
        recordRepresentation={"title"}
        edit={PartnerEdit}
        create={PartnerCreate}
        hasEdit={permissions !== 'manager'}
        hasCreate={permissions !== 'manager'}
      />

      <Resource
        name="users"
        options={{
          label: "Пользователи",
        }}
        icon={UserIcon}
        list={permissions === 'admin' ? UserList : undefined}
        recordRepresentation={"name"}
        edit={permissions === 'admin' ? UserEdit : undefined}
        create={permissions === 'admin' ? UserCreate : undefined}
      />
    </>
  )}
</Admin>;

export default App;

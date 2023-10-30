import { Clients } from "./components/Clients";
import { Offices } from "./components/Offices";
import { ClientSettings } from "./components/ClientSettings";
import { OfficeSettings } from "./components/OfficeSettings";
import { Trigger } from "./components/Trigger";
import { Login } from "./components/Login";

const AppRoutes = [
    {
        index: true,
        element: <Login />
    },
    {
        path: "/clients",
        element: <Clients />
    },
    {
        path: "/clientsettings/:clientid",
        element: <ClientSettings />
    },
    {
        path: "/officesettings/:whiseofficeid",
        element: <OfficeSettings />
    },
    {
        path: "/trigger/:whiseofficeid",
        element: <Trigger />
    }

];

export default AppRoutes;

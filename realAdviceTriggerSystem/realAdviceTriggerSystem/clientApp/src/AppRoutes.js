import { Clients } from "./components/Clients";
import { Offices } from "./components/Offices";
import { ClientSettings } from "./components/ClientSettings";
import { OfficeSettings } from "./components/OfficeSettings";

const AppRoutes = [
    {
        index: true,
        element: <Clients />
    },
    {
        path: "/clientsettings/:clientid",
        element: <ClientSettings />
    },
    {
        path: "/officesettings/:officeid",
        element: <OfficeSettings />
    }

];

export default AppRoutes;

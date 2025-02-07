import { Tab, TabList } from "@fluentui/react-components";
import { createFileRoute, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

const enum CE_SettingPages {
    EditProfile = "edit",
    Security = "security",
    Preference = "preference",
}

const SettingLayout: React.FC = () => {
    const navigate = useNavigate();
    const matchRoute = useMatchRoute();

    const [selectedTab, setSelectedTab] = React.useState<CE_SettingPages>(CE_SettingPages.EditProfile);
    const checkMatch = (page: CE_SettingPages) => matchRoute({ to: `/user/$id/${page}` }) && setSelectedTab(page);

    // Fuck! Tanstack Router designed this like shit!
    React.useEffect(() => {
        checkMatch(CE_SettingPages.EditProfile);
        checkMatch(CE_SettingPages.Security);
        checkMatch(CE_SettingPages.Preference);
    });

    return (
        <div>
            <div>
                <TabList
                    selectedValue={selectedTab}
                    onTabSelect={(_, { value }) => {
                        navigate({ to: `../${value}` });
                    }}
                >
                    <Tab value={CE_SettingPages.EditProfile}>Edit Profile</Tab>
                    <Tab value={CE_SettingPages.Security}>Security</Tab>
                    <Tab value={CE_SettingPages.Preference}>Preference</Tab>
                </TabList>
            </div>

            <div>
                <Outlet />
            </div>
        </div>
    );
};

export const Route = createFileRoute("/user/$id/_setting-layout")({
    component: SettingLayout,
});

import { Tab, TabList } from "@fluentui/react-components";
import { createFileRoute, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

import { PermissionDeniedError } from "@/common/exceptions/permission-denied";
import { SignInRequiredError } from "@/common/exceptions/sign-in-required";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { canEditUserSettings } from "@/permission/checkers";

const enum CE_SettingPages {
    EditProfile = "edit",
    Security = "security",
    Preference = "preference",
}

const SettingLayout: React.FC = () => {
    const navigate = useNavigate();
    const matchRoute = useMatchRoute();

    const [selectedTab, setSelectedTab] = React.useState<CE_SettingPages>(CE_SettingPages.Preference);
    const checkMatch = (page: CE_SettingPages) => matchRoute({ to: `/user/$id/${page}` }) && setSelectedTab(page);

    // Fuck! Tanstack Router designed this like shit!
    React.useEffect(() => {
        checkMatch(CE_SettingPages.Preference);
        checkMatch(CE_SettingPages.EditProfile);
        checkMatch(CE_SettingPages.Security);
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
                    <Tab value={CE_SettingPages.Preference}>Preference</Tab>
                    <Tab value={CE_SettingPages.EditProfile}>Edit Profile</Tab>
                    <Tab value={CE_SettingPages.Security}>Security</Tab>
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
    errorComponent: ErrorPageLazy,
    beforeLoad: ({ context: { currentUser, permission }, params: { id } }) => {
        if (!currentUser) {
            throw new SignInRequiredError();
        }

        if (!canEditUserSettings(Number.parseInt(id), currentUser, permission)) {
            throw new PermissionDeniedError();
        }
    },
});

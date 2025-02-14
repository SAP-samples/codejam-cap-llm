# Instructor Setup for the CodeJam

## The SAP BTP subaccount details

1. Log in the [SAP BTP Global Account: Developer Advocates Free Tier](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/accountModel&//?section=HierarchySection&view=TreeTableView)

2. Navigate to the directories and subaccounts section. There you will find a folder for CodeJams. Within that is the subaccount [CAP AI CodeJam](https://emea.cockpit.btp.cloud.sap/cockpit/#/globalaccount/275320f9-4c26-4622-8728-b6f5196075f5/subaccount/6088766d-dcc4-4e56-972f-652baad796be/subaccountoverview)

![subaccount overview](./assets/instructor-guide/subaccount.png)

## Enable Cloud Foundry runtime environment and create a development space

1. Enable the Cloud Foundry environment via the **Enable Cloud Foundry** button.

2. Use the default enablement dialog choices

3. Once the organisation is created, create a Cloud Foundry space and name it `dev`.

![create_space_action](./assets/instructor-guide/createSpace.png)

![create_space_roles](./assets/instructor-guide/createSpace2.png)

4. Add the other instructors as Space Members with all roles.

![add_space_members](./assets/instructor-guide/spaceMembers.png)

## Provisioning of SAP HANA Cloud

Follow the instructions in the [SAP BTP Setup Guide](./btp-setup-guide.md) or follow the steps in the [Deploy SAP HANA Cloud - tutorial](https://developers.sap.com/tutorials/hana-cloud-deploying.html).

## Adding attendees as users

1. Navigate to the **Security** section in your subaccount.

![add_users_security_nav](./assets/instructor-guide/add_users_security_nav.png)

2. Create the users.

![create_users_security](./assets/instructor-guide/create_users_security.png)

3. Enter the email address of the participant and use the `Default identity provider`.

![create_users_security_details](./assets/instructor-guide/create_users_security_details.png)

4. Assign them to the `CodeJam Participant` Role Collection.

![assign_role_collection](./assets/instructor-guide/assign_role_collection.png)

![assing_role_collection_selection](./assets/instructor-guide/assing_role_collection_selection.png)

5. Assign the users to the Cloud Foundry `dev` space by navigating to the `space -> security`.

![add_users_to_dev_space](./assets/instructor-guide/add_users_to_dev_space.png)

## Clean Up after the event

1. Delete all the HDI container instances from the SAP BTP cockpit subaccount/instances view.

![delete_hdi_container](./assets/instructor-guide/delete_hdi_container.png)

2. Disable the Cloud Foundry environment. This will remove all users access at the CF level and cleans up the remaining resources.

![clean_up_cf](./assets/instructor-guide/cleanupCloudFoundry.png)

3. Open the SAP HANA Cloud instance.

![open_hana_instance](./assets/instructor-guide/open_hana_instance.png)

4. Delete the SAP HANA Cloud instance.
 
![delete_hana_instance](./assets/instructor-guide/delete_hana_instance.png)

5. Remove the users from the subaccount.

![delete_users](./assets/instructor-guide/delete_users.png)

6. Delete the SAP AI Core instance.

![delete_ai_core](./assets/instructor-guide/delete_ai_core.png)

7. Delete the SAP AI Launchpad instance.

![delete_ai_launchpad](./assets/instructor-guide/delete_ai_launchpad.png)
import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Plan {
    packages: Array<HostingPackage>;
    cost: string;
    name: string;
}
export interface HostingPlans {
    vps: Plan;
    domainOnly: Plan;
    sharedPlan: Plan;
    dedicated: Plan;
}
export interface HostingPackage {
    cpu: string;
    ram: string;
    storage: string;
    name: string;
    lifetime: Variant_oneYear_fiveYears;
    websites: bigint;
}
export interface Account {
    id: string;
    purchasedPlan?: HostingPackage;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_oneYear_fiveYears {
    oneYear = "oneYear",
    fiveYears = "fiveYears"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllAccounts(): Promise<Array<Account>>;
    getCallerUserRole(): Promise<UserRole>;
    getPlans(): Promise<HostingPlans>;
    getPurchasedPlan(): Promise<HostingPackage | null>;
    isCallerAdmin(): Promise<boolean>;
    purchasePlan(purchasedPlan: HostingPackage): Promise<void>;
}

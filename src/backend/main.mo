import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type HostingPackage = {
    name : Text;
    lifetime : { #oneYear; #fiveYears };
    cpu : Text;
    ram : Text;
    storage : Text;
    websites : Nat;
  };

  module HostingPackage {
    public func compareByLifetime(a : HostingPackage, b : HostingPackage) : Order.Order {
      switch (Text.compare(a.name, b.name)) {
        case (#equal) { compareLifetime(a.lifetime, b.lifetime) };
        case (order) { order };
      };
    };

    func compareLifetime(lifetimeA : { #oneYear; #fiveYears }, lifetimeB : { #oneYear; #fiveYears }) : Order.Order {
      switch (lifetimeA, lifetimeB) {
        case (#oneYear, #fiveYears) { #less };
        case (#fiveYears, #oneYear) { #greater };
        case (_) { #equal };
      };
    };
  };

  type Plan = {
    name : Text;
    cost : Text;
    packages : [HostingPackage];
  };

  type HostingPlans = {
    domainOnly : Plan;
    sharedPlan : Plan;
    vps : Plan;
    dedicated : Plan;
  };

  type Account = {
    id : Text;
    purchasedPlan : ?HostingPackage;
  };

  let accounts = Map.empty<Principal, Account>();

  func compareAccountsById(a1 : Account, a2 : Account) : Order.Order {
    Text.compare(a1.id, a2.id);
  };

  public query ({ caller }) func getAllAccounts() : async [Account] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all accounts");
    };
    let accountsIter = accounts.values();
    let accountsArray = accountsIter.toArray();
    accountsArray.sort(compareAccountsById);
  };

  public query ({ caller }) func getPurchasedPlan() : async ?HostingPackage {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view purchased plans");
    };
    switch (accounts.get(caller)) {
      case (null) {
        Runtime.trap("No account found for the current user");
      };
      case (?account) {
        account.purchasedPlan;
      };
    };
  };

  public shared ({ caller }) func purchasePlan(purchasedPlan : HostingPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase plans");
    };
    switch (accounts.get(caller)) {
      case (null) { Runtime.trap("No account found for the current user") };
      case (?account) {
        let updatedAccount : Account = {
          id = account.id;
          purchasedPlan = ?purchasedPlan;
        };
        accounts.add(caller, updatedAccount);
      };
    };
  };

  public query ({ caller }) func getPlans() : async HostingPlans {
    {
      domainOnly = {
        name = "Domain Only";
        cost = "From €2/y";
        packages = [] : [HostingPackage];
      };
      sharedPlan = {
        name = "Shared";
        cost = "From €3.50/m";
        packages = [
          {
            name = "Basic";
            lifetime = #oneYear;
            cpu = "1";
            ram = "1GB";
            storage = "20GB";
            websites = 1;
          },
          {
            name = "Standard";
            lifetime = #oneYear;
            cpu = "2";
            ram = "2GB";
            storage = "100GB";
            websites = 5;
          },
        ];
      };
      vps = {
        name = "VPS";
        cost = "From €15.30/m";
        packages = [
          {
            name = "Package 1";
            lifetime = #oneYear;
            cpu = "2";
            ram = "4GB";
            storage = "80GB";
            websites = 10;
          },
          {
            name = "Package 2";
            lifetime = #oneYear;
            cpu = "6";
            ram = "24GB";
            storage = "280GB";
            websites = 50;
          },
          {
            name = "Package 3";
            lifetime = #oneYear;
            cpu = "12";
            ram = "48GB";
            storage = "568GB";
            websites = 100;
          },
        ];
      };
      dedicated = {
        name = "Dedicated Server";
        cost = "From €49/m";
        packages = [] : [HostingPackage];
      };
    };
  };
};

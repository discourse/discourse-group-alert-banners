import Component from "@ember/component";
import { computed } from "@ember/object";
import discourseComputed from "discourse-common/utils/decorators";

export default Component.extend({
  tagName: "",
  settingParsed: computed(function () {
    return JSON.parse(settings.nav_links);
  }),

  @discourseComputed("settingParsed", "currentUser")
  allowedGroups(settingParsed, user) {
    if (!user) {
      return;
    }

    let userGroups = [];
    let allowedGroups = [];

    user.groups.forEach((group) => {
      userGroups.push(group.name);
    });

    settingParsed.forEach((setting) => {
      let groupNames = setting.group_name.split(", ");
      let excludeNames = setting.group_exclude.split(", ");

      function arrayMatch(arr, arr2) {
        return arr.every((i) => arr2.includes(i));
      }

      setting["className"] = setting.group_name
        .replace(/\s/g, "")
        .replace(/,/g, "-");

      if (arrayMatch(groupNames, userGroups)) {
        if (!arrayMatch(excludeNames, userGroups)) {
          allowedGroups.push(setting);
        }
      }
    });

    return allowedGroups;
  },
});

/* eslint-disable ember/no-classic-components */
import Component from "@ember/component";
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/template";
import { tagName } from "@ember-decorators/component";
import icon from "discourse/helpers/d-icon";
import { and } from "discourse/truth-helpers";

@tagName("")
export default class CustomGroupMessages extends Component {
  @computed
  get settingParsed() {
    return settings.nav_links;
  }

  @computed("settingParsed", "currentUser")
  get allowedGroups() {
    if (!this.currentUser) {
      return;
    }

    let userGroups = [];
    let allowedGroups = [];

    this.currentUser.groups.forEach((group) => {
      userGroups.push(group.name);
    });

    this.settingParsed.forEach((setting) => {
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
  }

  <template>
    {{#each this.allowedGroups as |ag|}}
      <div class="custom-group-message custom-group-message-{{ag.className}}">
        <div class="custom-group-message-content">
          {{htmlSafe ag.content}}
        </div>
        {{#if (and ag.button_url ag.button_text)}}
          <a href={{ag.button_url}} class="btn btn-primary btn-text">
            {{#if ag.button_icon}}
              {{icon ag.button_icon}}
            {{/if}}
            {{ag.button_text}}
          </a>
        {{/if}}
      </div>
    {{/each}}
  </template>
}

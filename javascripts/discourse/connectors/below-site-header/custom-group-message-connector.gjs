import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import CustomGroupMessages from "../../components/custom-group-messages";

@classNames("below-site-header-outlet", "custom-group-message-connector")
export default class CustomGroupMessageConnector extends Component {
  <template>
    <div class="wrap custom-group-messages">
      <CustomGroupMessages />
    </div>
  </template>
}

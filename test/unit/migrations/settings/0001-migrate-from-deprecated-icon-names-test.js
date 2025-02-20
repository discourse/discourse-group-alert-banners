import { module, test } from "qunit";
import migrate from "../../../../migrations/settings/0001-migrate-from-deprecated-icon-names";

const helpers = {
  isValidUrl: (url) => {
    if (url.startsWith("/") || url.match(/^#([^#]*)/)) {
      return true;
    }

    try {
      const uri = new URL(url);
      return ["http:", "https:"].includes(uri.protocol);
    } catch {
      return false;
    }
  },
};

module(
  "Unit | Migrations | Settings | 0001-migrate-from-deprecated-icon-names",
  function () {
    test("migrate", function (assert) {
      const settings = new Map(
        Object.entries({
          nav_links: JSON.stringify([
            {
              group_name: "Meta Group",
              group_exclude: "Settings Group",
              content: "some content",
              button_icon: "fab-facebook",
              button_text: "Facebook",
              button_url: "https://www.facebook.com",
            },
            {
              group_name: "Settings Group",
              group_exclude: "",
              content: "some content",
              button_icon: "fab fa-cog",
              button_text: "Settings",
              button_url: "/settings",
            },
            {
              group_name: "Users Group",
              group_exclude: "",
              button_icon: "user-friends",
              button_url: "not-a-valid-url",
            },
          ]),
        })
      );

      const result = migrate(settings, helpers);

      const expectedResult = new Map(
        Object.entries({
          nav_links: [
            {
              group_name: "Meta Group",
              group_exclude: "Settings Group",
              content: "some content",
              button_icon: "fab-facebook",
              button_text: "Facebook",
              button_url: "https://www.facebook.com",
            },
            {
              group_name: "Settings Group",
              group_exclude: "",
              content: "some content",
              button_icon: "fab-gear",
              button_text: "Settings",
              button_url: "/settings",
            },
            {
              group_name: "Users Group",
              group_exclude: "",
              content: undefined,
              button_icon: "user-group",
              button_text: undefined,
              button_url: "#",
            },
          ],
        })
      );
      assert.deepEqual(Array.from(result), Array.from(expectedResult));
    });

    test("migrate empty settings", function (assert) {
      const settings = new Map(Object.entries({}));
      const result = migrate(settings, helpers);
      assert.deepEqual(Array.from(result), Array.from(settings));
    });
  }
);

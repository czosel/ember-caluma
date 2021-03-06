import Component from "@ember/component";
import { getOwner } from "@ember/application";
import layout from "../templates/components/cf-field";
import { task, timeout } from "ember-concurrency";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";

/**
 * Component to display a label and input for a certain field of a document.
 *
 * ```hbs
 * {{cf-field field=someField}}
 * ```
 *
 * You can disable the field by passing `disabled=true`.
 *
 * @class CfFieldComponent
 * @argument {Field} field The field data model to render
 */
export default Component.extend({
  layout,
  classNames: ["uk-margin"],
  classNameBindings: ["field.question.hidden:uk-hidden"],

  calumaOptions: service(),
  componentOverride: computed("calumaOptions._overrides.[]", function() {
    // During testing the meta object is not necessarily set.
    try {
      const name = this.field.question.meta.widgetOverride;
      const overrides = this.calumaOptions.getComponentOverrides();
      if (name && overrides.some(override => override.component === name)) {
        return name;
      }
    } catch (error) {
      // Do nothing.
    }
  }),

  /**
   * Task to save a field. This will set the passed value to the answer and
   * save the field to the API after a timeout off 500 milliseconds.
   *
   * @todo Validate the value
   * @method save
   * @param {String|Number|String[]} value
   */
  save: task(function*(value) {
    const { environment } = getOwner(this).resolveRegistration(
      "config:environment"
    );

    /* istanbul ignore next */
    if (environment !== "test") {
      yield timeout(500);
    }

    const answer = this.get("field.answer");

    answer.set("value", value);

    yield this.field.validate.perform();

    try {
      return yield this.field.save.unlinked().perform();
    } catch (e) {
      // that's ok
    }
  }).restartable()
});

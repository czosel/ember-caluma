import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field-value", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders multiple choice questions", async function(assert) {
    this.set("field", {
      question: {
        __typename: "MultipleChoiceQuestion",
        multipleChoiceOptions: {
          edges: [
            {
              node: {
                slug: "option-a",
                label: "A"
              }
            },
            {
              node: {
                slug: "option-b",
                label: "B"
              }
            },
            {
              node: {
                slug: "option-c",
                label: "C"
              }
            }
          ]
        }
      },
      answer: {
        value: ["option-a", "option-b"]
      }
    });

    await render(hbs`{{cf-field-value field=field}}`);

    assert.equal(this.element.textContent.trim(), "A, B");
  });

  test("it renders choice questions", async function(assert) {
    this.set("field", {
      question: {
        __typename: "ChoiceQuestion",
        choiceOptions: {
          edges: [
            {
              node: {
                slug: "option-a",
                label: "A"
              }
            },
            {
              node: {
                slug: "option-b",
                label: "B"
              }
            },
            {
              node: {
                slug: "option-c",
                label: "C"
              }
            }
          ]
        }
      },
      answer: {
        value: "option-c"
      }
    });

    await render(hbs`{{cf-field-value field=field}}`);

    assert.equal(this.element.textContent.trim(), "C");
  });

  test("it renders text questions", async function(assert) {
    this.set("field", {
      question: {
        __typename: "TextQuestion"
      },
      answer: {
        value: "foo"
      }
    });

    await render(hbs`{{cf-field-value field=field}}`);

    assert.equal(this.element.textContent.trim(), "foo");
  });
});

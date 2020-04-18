function TestSuit(test_name, output_div_id) {
    this.name = test_name;
    const output_div = document.getElementById(output_div_id);

    if (output_div != null) {
        var element = document.createElement('div');
        element.innerHTML = `<span>
            ----------------------<br/>
            ${this.name}<br/>
            ----------------------<br/>
        </span>`.trim();
        output_div.appendChild(element);
    }

    function output_message(msg, color) {
        if (output_div == null) {
            console.log(msg);
            return;
        }
        var element = document.createElement('div');
        element.innerText = msg;
        element.setAttribute('style', `color:${color};`);
        output_div.appendChild(element);
    }

    this.expectTrue = function(test_case_name, condition, extra_msg) {
        if (condition) {
            output_message(`[${test_case_name}]: passed.`, 'green');
            return;
        }
        var msg = (extra_msg == undefined) ? '' : extra_msg;
        output_message(`[${test_case_name}]: failed. ${msg}`, 'red');
    }

    this.expectFalse = function(test_case_name, condition, extra_msg) {
        this.expectTrue(test_case_name, !condition, extra_msg);
    }

    const isEquals = (actual_value, expected_value, comparator) => {
        if (comparator == undefined) {
            return actual_value == expected_value;
        }
        return comparator(actual_value, expected_value);
    }

    this.expectEquals = function(test_case_name, actual_value, expected_value, comparator) {
        this.expectTrue(test_case_name, isEquals(actual_value, expected_value, comparator), 
            `Expected value to be ${expected_value} but got ${actual_value}`);
    }

    this.expectNotEquals = function(test_case_name, actual_value, expected_value, comparator) {
        this.expectTrue(test_case_name, !isEquals(actual_value, expected_value, comparator), 
            `Expected value to be ${expected_value} but got ${actual_value}`);
    }
}
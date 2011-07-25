var WorkbenchLogin = new function() {

    var form = document.getElementById('login_form');

    this.initializeForm = function(loginType) {
        switchLoginTypeTo(form['loginType_' + loginType]);

        setFocus();

        buildServerUrl();

        bindEvent(form.loginType_std, "click", function () {switchLoginTypeTo(this)});
        bindEvent(form.loginType_adv, "click", function () {switchLoginTypeTo(this)});

        bindEvent(form.un, "keyup", toggleUsernamePasswordSessionDisabled);
        bindEvent(form.pw, "keyup", toggleUsernamePasswordSessionDisabled);
        bindEvent(form.sid, "keyup", toggleUsernamePasswordSessionDisabled);
        bindEvent(form.sid, "keyup", fuzzyServerUrlSelect);
        
        bindEvent(form.un, "change", toggleUsernamePasswordSessionDisabled);
        bindEvent(form.pw, "change", toggleUsernamePasswordSessionDisabled);
        bindEvent(form.sid, "change", toggleUsernamePasswordSessionDisabled);
        bindEvent(form.sid, "change", fuzzyServerUrlSelect);
                
        bindEvent(form.pw, "keypress", checkCaps); // must be keypress, not keyup

        bindEvent(form.inst, "keyup", buildServerUrl);
        bindEvent(form.api, "keyup", buildServerUrl);

        bindEvent(form.inst, "change", buildServerUrl);
        bindEvent(form.api, "change", buildServerUrl);
    };

    function switchLoginTypeTo(typeElem) {
        var advContainer = document.getElementById('advContainer');

        switch (typeElem.id) {
            case 'loginType_std':
                 form.loginType_std.checked = true;
                 advContainer.style.display = 'none';
                break;
            case 'loginType_adv':
                form.loginType_adv.checked = true;
                advContainer.style.display = 'block';
                break;
            default:
                console.error('Invalid login type');
        }

        // remove focus from login type controls
        setFocus();
    }

    function setFocus() {
        if (form.un.value == null || form.un.value == "") {
            form.un.focus();
        } else {
            form.pw.focus();
        }
    }

    function checkCaps(event) {
        var key = 0;
        var shifted = false;

        // IE
        if ( document.all ) {
            key = event.keyCode;
        // Everything else
        } else {
            key = event.which;
        }

        shifted = event.shiftKey;

        var pwcaps = document.getElementById('pwcaps');

        var upper = (key >= 65 && key <= 90);
        var lower = (key >= 97 && key <= 122);

        if ( (upper && !shifted) || (lower && shifted) ) {
            pwcaps.style.visibility='visible';
        } else if ( (lower && !shifted) || (upper && shifted) ) {
            pwcaps.style.visibility='hidden';
        }
    }

    function toggleUsernamePasswordSessionDisabled() {
        if (form.sid.value) {
            form.un.disabled = true;
            form.pw.disabled = true;
        } else {
            form.un.disabled = false;
            form.pw.disabled = false;
        }

        if (form.un.value || form.pw.value) {
            form.sid.disabled = true;
        } else {
            form.sid.disabled = false;
        }
    }

    function fuzzyServerUrlSelect() {
        var sid = form.sid.value
        var sidIndex = sid.indexOf('00D');

        if (sidIndex > -1) {
            var serverId = sid.substring(sidIndex + 3, sidIndex + 4);
            var inst = wbLoginConfig.serverIdMap[serverId];
            if (inst != null) {
                form.inst.value = inst;
                buildServerUrl();
            }
        }
    }


    function buildServerUrl() {
        form.serverUrl.value = 'http' +
                                (wbLoginConfig.useHTTPS && (form.inst.value.search(/localhost/i) == -1) ? 's' : '') +
                                '://' +
                                form.inst.value +
                                '.salesforce.com/services/Soap/u/' +
                                form.api.value;
    }

    function bindEvent(el, eventName, eventHandler) {
        if (el.addEventListener){
            el.addEventListener(eventName, eventHandler, false);
        } else if (el.attachEvent){
            el.attachEvent("on"+eventName, eventHandler);
        }
    }
};
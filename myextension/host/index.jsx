
function functionA() {
    eval("@JSXBIN@ES@2.0@MyBbyBnABMAbyBn0ABJBnAEjzFjBjMjFjSjUBfRBFeLiYjJjOhAjDjInAjPhBhBhBff0DzMjSjVjOiGjVjOjDjUjJjPjOiBCACBJEnAEjzPjDjBjMjMiCjBjDjLiGjVjDjUjJjPjODfRBjCfff0DzAEByB");
}

function functionB() {
    eval("@JSXBIN@ES@2.0@MyBbyBnABMAbyBn0ABJBnAEjzFjBjMjFjSjUBfRBFeTiNjJjTjTjJjPjOhAjDjPjNjQjMjFjUjFhBhBhBff0DzMjSjVjOiGjVjOjDjUjJjPjOiCCACBJEnAEjzPjDjBjMjMiCjBjDjLiGjVjDjUjJjPjODfRBjCfff0DzAEByB");
}

function runFunctionB() {
    alert('Mission complete!!!');
}

//#region Check License

function callBackFuction(functionName) {
    var ret = "";
    try {
        var results = requestAPI().split('#');
        if (results[0] === "0") {
            //Không tồn tại license
            alert('License Key: "' + results[1] + '" chưa được cấp phép, vui lòng liên hệ với quản trị viên!');
            removeLicenseKey();
        } else if (results[0] === "2") {
            //Hết hiệu lực
            alert('License Key: "' + results[1] + '" đã hết hạn, vui lòng liên hệ với quản trị viên!');
            removeLicenseKey();
        } else if (results[0] === "3") {
            //Không chính chủ
            alert('License Key: "' + results[1] + '" không được cấp phép cho bạn, vui lòng liên hệ với quản trị viên!');
            removeLicenseKey();
        } else if (results[0] === "1") {
            //Còn hiệu lực
            //Lần đầu kích hoạt
            if (firstAddLicenseKey(results[1])) {
                setLicenseKey(results[1]);
                alert('Kích hoạt thành công ứng dụng!\n\nCảm ơn bạn đã ủng hộ vào quỹ phòng chống Covid 2.000(VNĐ)!');
            }
            //Thực hiện chương trình!
            ret = functionName();
        } else if (results[0] === "-2") {
            //Require License
            alert('Require License');
            removeLicenseKey();
        } else {
            //Xảy ra lỗi bên trong
            alert(results[1]);
            removeLicenseKey();
        }
    } catch (ex) {
        return ex.message;
    }
    return ret;
}

//Call Web API
function requestAPI() {
    try {
        var uuid = getOSUUID();
        var licenseKey = getLicenseKey();
        if (licenseKey === null || licenseKey === "") {
            return "-2#Require License Key!";
        }
        var host = "14.232.208.178:2111";
        var api = host + "/api/license?uuid=" + uuid + "&key=" + licenseKey;
        var reply = "";
        var conn = new Socket();
        if (conn.open(host, "binary")) {
            var context = "GET http://" + api + " HTTP/1.0\r\nHost:" + host + "\r\nConnection: complete\r\n\r\n"
            conn.write(context);
            reply = conn.read(999999);
            conn.close();
            //0: Không tồn tại license
            //1: Còn hiệu lực
            //2: Hết hiệu lực
            //3: Không chính chủ
            reply = reply.split('#')[1];
            if (reply === undefined) {
                return "-1#Máy chủ không phản hồi yêu cầu. Vui lòng liên hệ với quản trị viên!";
            } else {
                return reply + "#" + licenseKey;
            }
        } else {
            return "-1#Không thể kết nối tới máy chủ. Vui lòng liên hệ với quản trị viên!";
        }
    } catch (ex) {
        return "-1#" + ex.message;
    }
}

function removeLicenseKey() {
    var fileKey = new File(Folder.temp + "/licenseKeyExtensionPS.dat");
    if (fileKey.open("r")) {
        fileKey.close();
        fileKey.remove();
    }
}

function firstAddLicenseKey(license) {
    var fileKey = new File(Folder.temp + "/licenseKeyExtensionPS.dat");
    if (fileKey.open("r")) {
        var currentLicense = fileKey.read();
        fileKey.close();
        if (currentLicense === license) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

function setLicenseKey(licenseKey) {
    var fileKey = new File(Folder.temp + "/licenseKeyExtensionPS.dat");
    if (fileKey.open("w")) {
        fileKey.write(licenseKey);
        fileKey.close();
    }
}

function getLicenseKey() {
    var result = "";
    var uuid = getOSUUID();
    var fileKey = new File(Folder.temp + "/licenseKeyExtensionPS.dat");
    if (fileKey.open("r")) {
        result = fileKey.read();
        fileKey.close();
    } else {
        result = prompt("UUID System: " + uuid + "\n\nVới mỗi license bạn đã góp phần ủng hộ vào quỹ phòng chống Covid 2.000(VNĐ)!", "");
    }
    return result;
}

function isMacOS() {
    return ($.os.toLowerCase().indexOf('mac') >= 0);
}

function getOSUUID() {
    var uuid = "";
    var tempFile = new File(Folder.temp + "/temp.txt");
    var command = "";
    var flagOS = isMacOS();
    if (flagOS) {
        command = 'uuidgen';
    } else {
        command = 'wmic csproduct get "UUID"';
    }
    app.system(command + " > " + tempFile.fsName);
    if (tempFile.open("r")) {
        var txtLine = "";
        var line = flagOS ? 1 : 2;
        var i = 1;
        while (!tempFile.eof) {
            txtLine = tempFile.readln();
            if (i === line) {
                uuid = txtLine;
                break;
            }
            i++;
        };
        tempFile.close();
        // tempFile.remove();
    }
    uuid = trim(uuid);
    return uuid;
}

function trim(str) {
    return str.replace(/^\s+/, '').replace(/\s+$/, '');
}

function getUserName() {
    return (isMacOS()) ? $.getenv("USER") : $.getenv("USERNAME");
}

//#endregion
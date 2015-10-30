function Logger(obj) {
  this.logList = [];
  this.logFileName = 'log_';
  this.logFileExtension = '.txt';

  this.init();
}

Logger.prototype.init = function () {
  var self = this;
  var _log = console.log,
    _warn = console.warn,
    _error = console.error;

  console.log = function() {
      self.log(arguments[0], JSON.stringify(arguments[1]));
      return _log.apply(console, arguments);
  };

  console.warn = function() {
      self.log(arguments[0], JSON.stringify(arguments[1]));
      return _warn.apply(console, arguments);
  };

  console.error = function() {
      self.log(arguments[0], JSON.stringify(arguments[1]));
      return _error.apply(console, arguments);
  };

  window.onerror = function (msg, url, lineNumber, column, errorObj) {
    self.log(msg, errorObj.stack, url, lineNumber, column);
  };
};

Logger.prototype.log = function (msg, errorObj, url, lineNumber, column) {
  var self = this;

  var log = {};
  log.message = msg;
  log.url = url;
  log.lineNumber = lineNumber;
  log.column = column;
  log.errorObj = errorObj;
  log.date = new Date();

  self.logList.push(log);
};

Logger.prototype.downloadLog = function() {
  var self = this;
	    var file = "data:text/plain;charset=utf-8,";
	    var logFile = self.getLog();
	    var encoded = encodeURIComponent(logFile);
	    file += encoded;
	    var a = document.createElement('a');
	    a.href = file;
	    a.target   = '_blank';
	    a.download = self.logFileName + new Date().getTime() + self.logFileExtension;
	    document.body.appendChild(a);
	    a.click();
	    a.remove();
	}

Logger.prototype.getLog = function() {
  var self = this;
		var logStr = '';
    for(i =0; i<self.logList.length; i++) {
      logStr += '\r\n[' + self.logList[i].date + ']\r\nMessage: ' + self.logList[i].message + '\r\n';
      if(self.logList[i].url)
        logStr += 'Script: ' + self.logList[i].url + '\r\n';
      if(self.logList[i].lineNumber)
        logStr += 'Line: ' + self.logList[i].lineNumber + '\r\n';
      if(self.logList[i].column)
        logStr += 'Column: ' + self.logList[i].column + '\r\n';
      if(self.logList[i].errorObj)
        logStr += 'StackTrace: ' +  self.logList[i].errorObj + '\r\n';
    }

    return logStr;
	}

  var logger = new Logger();

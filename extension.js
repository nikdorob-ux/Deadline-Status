const vscode = require('vscode');

function activate(context) {
  const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);

  const update = () => {
    const value = vscode.workspace.getConfiguration('deadlineStatus').get('deadline');

    if (!value) {
      item.hide();
      return;
    }

    const deadline = new Date(value);
    const seconds = Math.floor((deadline.getTime() - Date.now()) / 1000);
    
    if (Number.isNaN(deadline.getTime())) item.text = '$(warning) Set a valid deadline';
    else if (seconds <= 0) item.text = '$(alarm) Deadline passed';
    else {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      item.text = `$(clock) Deadline: ${days}d ${hours}h ${minutes}m`;
    }
    item.show();
  };
  
  update();
  const timer = setInterval(update, 60000);
  context.subscriptions.push(item, { dispose: () => clearInterval(timer) });
}

function deactivate() {}
exports.activate = activate;
exports.deactivate = deactivate;

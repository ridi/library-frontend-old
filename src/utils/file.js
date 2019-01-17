export const downloadFile = (downloadUrl, fileName) => {
  const downloadButton = document.createElement('a');
  downloadButton.href = downloadUrl;
  downloadButton.download = fileName;
  document.body.appendChild(downloadButton);
  downloadButton.click();
  document.body.removeChild(downloadButton);
};

export const formatFileSize = size => {
  if (!size) {
    return '';
  }
  const oneMegabyte = 1024;
  return `${(size / oneMegabyte).toFixed(1)}MB`;
};

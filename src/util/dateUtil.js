export const formatTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const formatLocaleTime = (isoString) => {
    const date = new Date(isoString);
    // 格式化为 yyyy/mm/dd hh:mm:ss
    return formatTime(date).replaceAll("-", "/");
}
export const formatISOTime= (date) => {
    date.setHours(date.getHours() - 8)
    return formatTime(date)
}

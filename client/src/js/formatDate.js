export default function formatDate(n) {
  const date = new Date(n);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  return `${hour}:${minutes} ${day}.${month}.${year}`;
}

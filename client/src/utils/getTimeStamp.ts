export default function getTimeStamp() {
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();

  return `${hour}:${minutes}`;
}

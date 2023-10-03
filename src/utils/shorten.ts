export default function shorten(str: string) {
    if (str.length < 10) return str;
    return `${str.slice(0, 10)}...${str.slice(str.length - 8)}`;
};

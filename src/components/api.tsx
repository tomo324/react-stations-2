export const fetchFromApi = () =>{
    return (
        fetch('https://railway.bulletinboard.techtrain.dev/threads')
        .then((res) => res.json())
        .catch((e) => e)
    );
};
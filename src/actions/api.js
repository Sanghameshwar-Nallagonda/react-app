import axios from "axios";

const baseUrl = "http://localhost:62786/api/"
//const baseUrl = "http://localhost:60671/api/"



export default {

    dCandidate(url = baseUrl + 'AssetsTree/') {
        return {
            fetchAll: () => axios.get(url),
            fetchById: id => axios.get(url + id),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updateRecord) => axios.put(url + id, updateRecord),
            delete: id => axios.delete(url + id),
            upload: (uploadDataUrl) => axios.post(url, uploadDataUrl)
        }
    }
}
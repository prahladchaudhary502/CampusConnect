import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import NoticeForm from "../../components/dashboard/NoticeForm";

const EditNotice = () => {
    const { id } = useParams();
    const { axios } = useAppContext();
    const [notice, setNotice] = useState(null);

    useEffect(() => {
        const fetchNotice = async () => {
            const { data } = await axios.get(`/api/notice/${id}`);
            if (data.success) 
                setNotice(data.notice);
        };
        fetchNotice();
    }, [id]);

    if (!notice) return <p>Loading...</p>;
    return <NoticeForm existingNotice={notice} />;

};

export default EditNotice;

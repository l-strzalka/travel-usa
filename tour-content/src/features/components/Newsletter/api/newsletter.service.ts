import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/config'

export const {} = useQuery({
    queryFn: async () => {
        const response = await axios.get(
            `${API_URL}`
        )
    }
})
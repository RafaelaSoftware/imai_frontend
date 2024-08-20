import { Box, Flex, Input } from "@chakra-ui/react";
import ButtonCustom from "../buttons/ButtonCustom";
import { useAuth } from "@/app/libs/AuthProvider";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import moment from "moment-timezone";

export default function SearchEmpleados({ setEmpleados, refresh }) {
  const { directus, readItems } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const handleChange = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };
  const fetchParte = async (empleado, empleado_descripcion) => {
    try {
      const result = await directus.request(
        readItems("parte", {
          filter: {
            _and: [
              {
                inicio: {
                  _gte: new moment().startOf("day").toISOString(),
                },
                // fin: {
                //   _null: true,
                // },
              },
              {
                _or: [
                  {
                    empleado: {
                      _eq: empleado.trim(),
                    },
                  },
                  {
                    empleado_descripcion: {
                      _icontains: empleado_descripcion.trim(),
                    },
                  },
                ],
              },
            ],
          },
          limit: -1,
        })
      );
      return result.length >= 0 ? result : null;
    } catch (error) {
      return null;
    }
  };

  const fetchEmpleados = async () => {
    try {
      const queryFilter = {
        _and: [
          {
            egreso: {
              _null: true,
            },
          },
        ],
      };
      if (search) {
        queryFilter._and.push({
          _or: [
            {
              empleado: {
                _eq: search,
              },
            },
            {
              empleado_descripcion: {
                _icontains: search,
              },
            },
          ],
        });
      }

      const empleadosResult = await directus.request(
        readItems("fichada", {
          filter: {
            ...queryFilter,
          },
          limit: -1,
        })
      );

      const empleadosConPartes = await Promise.all(
        empleadosResult.map(async (empleado) => {
          empleado.partes = await fetchParte(
            empleado.empleado,
            empleado.empleado_descripcion
          );
          return empleado;
        })
      );
      
      return empleadosConPartes;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetchEmpleados();
    setEmpleados(result);
  };

  useEffect(() => {
    const fetchData = async () => {
      let results = [];
      const data = await fetchEmpleados();
      results = data || [];
      setEmpleados(results);
    };

    fetchData();
  }, [debouncedSearch, refresh]);
  return (
    <Flex alignItems={"center"} justifyContent={"flex-end"}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
        }}
      >
        <Flex width={"full"} justifyContent={"center"} gap={4}>
          <Box width={"50%"}>
            <Input
              id={"search"}
              name={"search"}
              type={"text"}
              placeholder={"Buscar Empleado"}
              value={search}
              onChange={handleChange}
              variant="filled"
              borderRadius="30"
              size="lg"
              bgColor="white"
              color="#C0C0C0"
              borderColor="#C0C0C0"
              _focus={{
                borderColor: "own",
              }}
            />
          </Box>
          <ButtonCustom width={"max-content"} type={"submit"}>
            Buscar
          </ButtonCustom>
        </Flex>
      </form>
    </Flex>
  );
}

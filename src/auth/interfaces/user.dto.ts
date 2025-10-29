export interface UserDTO {
  nombre: string;
  apellido1: string;
  apellido2: string;
  fechaNacimiento: string;
  sexo: string;
  email: string;
  role: string;
  password: string;
}

export interface UserDAO extends UserDTO {
  _id: number | string;
  state_id?: number | string;
}

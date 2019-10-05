export class Pokemon {
    // Atributos principales
    numero_nacional: string;
    numero_regional: string;
    region: string;
    nombre: string;
    tipoUno: string;
    tipoDos: string;
    genero: string;
    descripcion: string;

    // Nivel, Evo, Exp
    numeroEvolucion: number;
    nivelEvolucion: number;
    evoluciona: string;
    nivel?: number;
    experiencia?: number;
    contadorExp?: number;
    ContenedorExp?: number;
    MultiplicadorExp?: number;

    // Puntos de Estado/Estadísticas
    hp?: number;
    hp_max?: number;
    ataque?: number;
    defensa?: number;
    ataque_especial?: number;
    defensa_especial?: number;
    velocidad?: number;
    estado?: string;
    IV?: number;
    EV?: number;

    capturado?: number;
    favorito?: boolean;
    ball?: string;

    /**
     *
     * @param numNacional Numero generico e unico
     * @param numRegional Numero de la ona de origen
     * @param region Zona de origen
     * @param nombre Nombre propio
     * @param tipoUno Elemento principal
     * @param tipoDos Elemento secundario
     * @param genero Genero: macho u hembra
     *
     * @param numEvolucion 0 Legendario, 1 primera evolucion, 2 segunda ...
     * @param nvEvolucion Nivel requerido para evolucionar
     * @param evoluciona Numero que indica el numero nacional al que evoluciona
     * @param nivel Nivel actual
     * @param experiencia Experiencia actual
     * @param contadorExp algo
     * @param ContenedorExp algo
     * @param MultiplicadorExp algo
     *
     * @param hp algo
     * @param hpMAX algo
     * @param ataque algo
     * @param defensa algo
     * @param ataqueESP algo
     * @param defensaESP algo
     * @param velocidad algo
     * @param descripcion algo
     * @param estado algo
     * @param IV algo
     * @param EV algo
     *
     * @param capturado algo
     * @param favorito algo
     * @param ball algo
     */
    // constructor(numNacional: string, numRegional: string, region: string, nombre: string, tipoUno: string, tipoDos: string,
    //     genero: string, descripcion: string, numEvolucion: number, nvEvolucion: number, evoluciona: string,
    //     nivel?: number, experiencia?: number, contadorExp?: number, ContenedorExp?: number, MultiplicadorExp?: number,
    //     hp?: number, hpMAX?: number, ataque?: number, defensa?: number, ataqueESP?: number, defensaESP?: number,
    //     velocidad?: number, estado?: string, IV?: number, EV?: number, capturado?: number, favorito?: boolean, ball?: string) {

    //     this.numNacional = numNacional;
    //     this.numRegional = numRegional;
    //     this.region = region;
    //     this.nombre = nombre;
    //     this.tipoUno = tipoUno;
    //     this.tipoDos = tipoDos;
    //     this.genero = genero;
    //     this.descripcion = descripcion;

    //     this.numEvolucion = numEvolucion;
    //     this.nvEvolucion = nvEvolucion;
    //     this.evoluciona = evoluciona;
    //     this.nivel = nivel;
    //     this.experiencia = experiencia;
    //     this.contadorExp = contadorExp;
    //     this.ContenedorExp = ContenedorExp;
    //     this.MultiplicadorExp = MultiplicadorExp;

    //     this.hp = hp;
    //     this.hpMAX = hpMAX;
    //     this.ataque = ataque;
    //     this.defensa = defensa;
    //     this.ataqueESP = ataqueESP;
    //     this.defensaESP = defensaESP;
    //     this.velocidad = velocidad;
    //     this.estado = estado;
    //     this.IV = IV;
    //     this.EV = EV;

    //     this.capturado = capturado;
    //     this.favorito = favorito;
    //     this.ball = ball;
    // }

    // public get_numNacional() {
    //     return this.numNacional;
    // }

    // public get_numRegional() {
    //     return this.numRegional;
    // }

    // public get_region() {
    //     return this.region;
    // }

    // public get_nombre() {
    //     return this.nombre;
    // }

    // public get_tipoUno() {
    //     return this.tipoUno;
    // }

    // public get_tipoDos() {
    //     return this.tipoDos;
    // }

    // public get_numEvolucion() {
    //     return this.numEvolucion;
    // }

    // public get_nvEvolucion() {
    //     return this.nvEvolucion;
    // }

    // public get_evoluciona() {
    //     return this.evoluciona;
    // }

    // public get_nivel() {
    //     return this.nivel;
    // }

    // public get_experiencia() {
    //     return this.experiencia;
    // }

    // public get_genero() {
    //     return this.genero;
    // }

    // public get_hp() {
    //     return this.hp;
    // }

    // public get_hpMAX() {
    //     return this.hpMAX;
    // }

    // public get_ataque() {
    //     return this.ataque;
    // }

    // public get_defensa() {
    //     return this.defensa;
    // }

    // public get_ataqueESP() {
    //     return this.ataqueESP;
    // }

    // public get_defensaESP() {
    //     return this.defensaESP;
    // }

    // public get_velocidad() {
    //     return this.velocidad;
    // }

    // public get_descripcion() {
    //     return this.descripcion;
    // }

    // public get_estado() {
    //     return this.estado;
    // }

    // public get_favorito() {
    //     return this.favorito;
    // }

    // public get_capturado() {
    //     return this.capturado;
    // }

    // public get_ball() {
    //     return this.ball;
    // }

    // public get_IV() {
    //     return this.IV;
    // }

    // public get_EV() {
    //     return this.EV;
    // }


    // public set_numRegional(value: any) {
    //     this.numRegional = value;
    // }

    // public set_region(value: any) {
    //     this.region = value;
    // }

    // public set_nombre(value: any) {
    //     this.nombre = value;
    // }

    // public set_tipoUno(value: any) {
    //     this.tipoUno = value;
    // }

    // public set_tipoDos(value: any) {
    //     this.tipoDos = value;
    // }

    // public set_numEvolucion(value: any) {
    //     this.numEvolucion = value;
    // }

    // public set_nvEvolucion(value: any) {
    //     this.nvEvolucion = value;
    // }

    // public set_evoluciona(value: any) {
    //     this.evoluciona = value;
    // }

    // public set_nivel(value: any) {
    //     this.nivel = value;
    // }

    // public set_experiencia(value: any) {
    //     this.experiencia = value;
    // }

    // public set_genero(value: any) {
    //     this.genero = value;
    // }

    // public set_hp(value: any) {
    //     this.hp = value;
    // }

    // public set_hpMAX(value: any) {
    //     this.hpMAX = value;
    // }

    // public set_ataque(value: any) {
    //     this.ataque = value;
    // }

    // public set_defensa(value: any) {
    //     this.defensa = value;
    // }

    // public set_ataqueESP(value: any) {
    //     this.ataqueESP = value;
    // }

    // public set_defensaESP(value: any) {
    //     this.defensaESP = value;
    // }

    // public set_velocidad(value: any) {
    //     this.velocidad = value;
    // }

    // public set_descripcion(value: any) {
    //     this.descripcion = value;
    // }

    // public set_estado(value: any) {
    //     this.estado = value;
    // }

    // public set_favorito(value: any) {
    //     this.favorito = value;
    // }

    // public set_capturado(value: any) {
    //     this.capturado = value;
    // }

    // public set_ball(value: any) {
    //     this.ball = value;
    // }

    // public set_IV(value: any) {
    //     this.IV = value;
    // }

    // public set_EV(value: any) {
    //     this.EV = value;
    // }

}

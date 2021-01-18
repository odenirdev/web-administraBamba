const DataTables = (
    table,
    data = [],
    columns = [],
    drawCallback = () => {}
) => {
    const $ = require("jquery");
    $.DataTable = require("datatables.net");

    return $(table).DataTable({
        data,
        columns,
        language: {
            decimal: "",
            emptyTable: "Tabela Vazia",
            info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
            infoEmpty: "Mostrando 0 de 0 registros",
            infoFiltered: "",
            infoPostFix: "",
            thousands: ",",
            lengthMenu: "_MENU_ registros por página",
            loadingRecords: "Carregando...",
            processing: "Processando...",
            search: "Pesquisar:",
            zeroRecords: "Nenhum registro encontrado",
            paginate: {
                first: "Primeira",
                last: "Última",
                next: ">",
                previous: "<",
            },
            aria: {
                sortAscending: ": activate to sort column ascending",
                sortDescending: ": activate to sort column descending",
            },
        },
        drawCallback: () => {
            if (drawCallback) drawCallback();
        },
        destroy: true,
        order: [],
    });
};

export default DataTables;

using Microsoft.EntityFrameworkCore.Migrations;

namespace JK.Migrations
{
    public partial class AddHostServiceView : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE VIEW vw_HostServices AS
                SELECT 
                    Id, Name, Address, City, ContactNumber, WebsiteUrl,
                    ServiceType, 
                    CASE 
                        WHEN ServiceType = 'Institution' THEN Type
                        ELSE NULL
                    END AS InstitutionType
                FROM HostService
                WHERE ServiceType IN ('Shop', 'Institution');
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP VIEW IF EXISTS vw_HostServices;");
        }
    }
}

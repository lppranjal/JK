using Microsoft.EntityFrameworkCore.Migrations;

namespace JK.Migrations
{
    public partial class AddIndexes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("CREATE INDEX IX_HostServices_Name ON vw_HostServices(Name);");
            migrationBuilder.Sql("CREATE INDEX IX_HostServices_City ON vw_HostServices(City);");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS IX_HostServices_Name;");
            migrationBuilder.Sql("DROP INDEX IF EXISTS IX_HostServices_City;");
        }
    }
}
